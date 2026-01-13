-- minimal schema (adjust to your real schema)
CREATE TABLE IF NOT EXISTS role (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS useraccount (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(60) NOT NULL, -- bcrypt length
  role_id INTEGER REFERENCES role(id)
);

-- seed data
INSERT INTO role (id, name) VALUES (1, 'admin') ON CONFLICT DO NOTHING;
INSERT INTO useraccount (id, username, password, role_id) VALUES
(1, 'admin', '$2b$10$UQKQ6e.BWzomvZ/0QhJJiOsdEX3yqqba7HYd1iDTyG1BJ8Fmy2PP6', 1)
ON CONFLICT (username) DO NOTHING;
