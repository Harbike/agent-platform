-- Users, roles, permissions, user roles, role permission

-- 7. USER ACCOUNTS
CREATE TABLE users (
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    person_id     BIGINT UNIQUE REFERENCES people(id),
    email         VARCHAR(255) NOT NULL UNIQUE
        CHECK (email = lower(btrim(email))),            -- case-insensitive uniqueness
    password_hash TEXT NOT NULL,
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. ROLES
-- scope_type decides how a role's reach is computed:
--   GLOBAL = every area/position
--   AREA   = the areas listed in user_roles.area_id
--   TREE   = the user's current position and everything below it
CREATE TABLE roles (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    scope_type  VARCHAR(10) NOT NULL CHECK (scope_type IN ('GLOBAL', 'AREA', 'TREE')),
    description TEXT
);

-- 9. PERMISSIONS
CREATE TABLE permissions (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- 10. USER ROLE ASSIGNMENTS
CREATE TABLE user_roles (
    id      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    role_id BIGINT NOT NULL REFERENCES roles(id),
    area_id BIGINT REFERENCES areas(id),          -- only for AREA roles
    UNIQUE NULLS NOT DISTINCT (user_id, role_id, area_id)
);

CREATE FUNCTION validate_user_role() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE st TEXT;
BEGIN
  SELECT scope_type INTO st FROM roles WHERE id = NEW.role_id;
  IF st = 'AREA' AND NEW.area_id IS NULL THEN
    RAISE EXCEPTION 'AREA roles require an area';
  ELSIF st <> 'AREA' AND NEW.area_id IS NOT NULL THEN
    RAISE EXCEPTION '% roles cannot be tied to an area', st;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER user_roles_validate BEFORE INSERT OR UPDATE ON user_roles
  FOR EACH ROW EXECUTE FUNCTION validate_user_role();

-- 11. ROLE PERMISSIONS
CREATE TABLE role_permissions (
    role_id       BIGINT NOT NULL REFERENCES roles(id),
    permission_id BIGINT NOT NULL REFERENCES permissions(id),
    PRIMARY KEY (role_id, permission_id)
);
