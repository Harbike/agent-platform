-- Areas, people, agents, positions, position assignments, agent reporting

-- Conventions:
--   people.is_active   = still part of the organisation
--   agents.status      = operational state of the agent
--   users.is_active    = allowed to log in
--   "current" history row = end_date IS NULL

CREATE EXTENSION IF NOT EXISTS btree_gist;   -- for no-overlap constraints

CREATE FUNCTION set_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END $$;

-- 1. AREAS
CREATE TABLE areas (
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name       VARCHAR(150) NOT NULL UNIQUE,
    is_active  BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. PEOPLE
CREATE TABLE people (
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name  VARCHAR(200) NOT NULL,
    is_active  BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER people_updated_at BEFORE UPDATE ON people
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 3. AGENTS
CREATE TABLE agents (
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    person_id  BIGINT NOT NULL UNIQUE REFERENCES people(id),
    agent_code VARCHAR(50) NOT NULL UNIQUE,
    status     VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. MANAGEMENT POSITIONS
-- Hierarchy: AREA_MANAGER (top) -> REGIONAL_MANAGER -> DSM
-- To flip the direction, change only the CASE in validate_position().
CREATE TABLE positions (
    id                 BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    area_id            BIGINT NOT NULL REFERENCES areas(id),
    title              VARCHAR(50) NOT NULL
        CHECK (title IN ('AREA_MANAGER', 'REGIONAL_MANAGER', 'DSM')),
    parent_position_id BIGINT REFERENCES positions(id),
    is_active          BOOLEAN NOT NULL DEFAULT TRUE,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CHECK (parent_position_id IS NULL OR parent_position_id <> id),
    UNIQUE (id, title)            -- target for agent_reporting's composite FK
);
CREATE INDEX positions_parent_idx ON positions (parent_position_id);
CREATE INDEX positions_area_idx   ON positions (area_id);

-- One active Area Manager position per area (drop this index if you allow several).
CREATE UNIQUE INDEX one_active_area_manager_per_area
ON positions (area_id) WHERE title = 'AREA_MANAGER' AND is_active;

CREATE FUNCTION validate_position() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  par      positions%ROWTYPE;
  expected TEXT;
BEGIN
  expected := CASE NEW.title
    WHEN 'AREA_MANAGER'     THEN NULL
    WHEN 'REGIONAL_MANAGER' THEN 'AREA_MANAGER'
    WHEN 'DSM'              THEN 'REGIONAL_MANAGER'
  END;

  IF TG_OP = 'UPDATE'
     AND (NEW.title <> OLD.title OR NEW.area_id <> OLD.area_id)
     AND EXISTS (SELECT 1 FROM positions WHERE parent_position_id = NEW.id) THEN
    RAISE EXCEPTION 'Cannot change the title or area of a position that has child positions';
  END IF;

  IF expected IS NULL THEN
    IF NEW.parent_position_id IS NOT NULL THEN
      RAISE EXCEPTION 'AREA_MANAGER cannot have a parent position';
    END IF;
    RETURN NEW;
  END IF;

  IF NEW.parent_position_id IS NULL THEN
    RAISE EXCEPTION '% must have a parent position', NEW.title;
  END IF;

  SELECT * INTO par FROM positions WHERE id = NEW.parent_position_id;
  IF par.title <> expected THEN
    RAISE EXCEPTION '% must report to a %', NEW.title, expected;
  END IF;
  IF par.area_id <> NEW.area_id THEN
    RAISE EXCEPTION 'Parent position must be in the same area';
  END IF;
  -- Cycles are impossible: every level strictly descends in title.
  RETURN NEW;
END $$;

CREATE TRIGGER positions_validate
  BEFORE INSERT OR UPDATE OF title, area_id, parent_position_id ON positions
  FOR EACH ROW EXECUTE FUNCTION validate_position();

-- 5. POSITION ASSIGNMENTS (history of who held each position)
CREATE TABLE position_assignments (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    position_id BIGINT NOT NULL REFERENCES positions(id),
    person_id   BIGINT NOT NULL REFERENCES people(id),
    start_date  DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date    DATE,

    CHECK (end_date IS NULL OR end_date >= start_date),
    -- no overlapping periods; a handover (old end = new start) is allowed
    EXCLUDE USING gist (position_id WITH =, daterange(start_date, end_date, '[)') WITH &&),
    EXCLUDE USING gist (person_id   WITH =, daterange(start_date, end_date, '[)') WITH &&)
);
CREATE UNIQUE INDEX one_current_position_per_person
  ON position_assignments (person_id)   WHERE end_date IS NULL;
CREATE UNIQUE INDEX one_current_occupant_per_position
  ON position_assignments (position_id) WHERE end_date IS NULL;

-- 6. AGENT REPORTING (each agent reports to one DSM position)
CREATE TABLE agent_reporting (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    agent_id        BIGINT NOT NULL REFERENCES agents(id),
    dsm_position_id BIGINT NOT NULL,
    dsm_title       VARCHAR(50) NOT NULL DEFAULT 'DSM' CHECK (dsm_title = 'DSM'),
    start_date      DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date        DATE,

    CHECK (end_date IS NULL OR end_date >= start_date),
    FOREIGN KEY (dsm_position_id, dsm_title) REFERENCES positions (id, title),
    EXCLUDE USING gist (agent_id WITH =, daterange(start_date, end_date, '[)') WITH &&)
);
CREATE UNIQUE INDEX one_current_dsm_per_agent
  ON agent_reporting (agent_id) WHERE end_date IS NULL;
CREATE INDEX agent_reporting_dsm_current_idx
  ON agent_reporting (dsm_position_id) WHERE end_date IS NULL;

