-- Roles and permissions

INSERT INTO roles (name, scope_type, description) VALUES
  ('super_admin',      'GLOBAL', 'Full access to everything'),
  ('auditor',          'GLOBAL', 'Read-only access, including audit logs'),
  ('area_admin',       'AREA',   'Administers the areas assigned in user_roles.area_id'),
  ('area_manager',     'TREE',   'Area Manager: own position and everything below'),
  ('regional_manager', 'TREE',   'Regional Manager: own position and everything below'),
  ('dsm',              'TREE',   'DSM: own position and the agents reporting to it')
ON CONFLICT (name) DO NOTHING;

INSERT INTO permissions (name, description) VALUES
  ('areas.read',        'List areas'),
  ('areas.manage',      'Create and edit areas'),
  ('positions.read',    'List positions and current occupants'),
  ('positions.manage',  'Create, edit and deactivate positions'),
  ('positions.assign',  'Put a person into a position'),
  ('managers.read',     'List managers'),
  ('managers.create',   'Create a manager and assign a position'),
  ('managers.update',   'Deactivate a manager'),
  ('agents.read',       'List and view agents'),
  ('agents.create',     'Create agents'),
  ('agents.update',     'Edit agents'),
  ('agents.reassign',   'Move an agent to another DSM'),
  ('audit.read',        'Read audit logs')
ON CONFLICT (name) DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON
     r.name = 'super_admin'
  OR (r.name = 'auditor' AND p.name IN
        ('areas.read','positions.read','managers.read','agents.read','audit.read'))
  OR (r.name = 'area_admin' AND p.name NOT IN ('areas.manage','audit.read'))
  OR (r.name IN ('area_manager','regional_manager') AND p.name IN
        ('areas.read','positions.read','positions.assign','managers.read','managers.create',
         'managers.update','agents.read','agents.create','agents.update','agents.reassign'))
  OR (r.name = 'dsm' AND p.name IN
        ('areas.read','positions.read','agents.read','agents.create','agents.update'))
ON CONFLICT DO NOTHING;
