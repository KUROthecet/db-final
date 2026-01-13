// generate-sql.js
const bcrypt = require('bcrypt');
const fs = require('fs');

(async () => {
  const password = '123';
  const rounds = 10; // giống với dự án mẫu
  const hash = await bcrypt.hash(password, rounds);

  const sql = `-- minimal schema (adjust to your real schema)
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
(1, 'admin', '${hash}', 1)
ON CONFLICT (username) DO NOTHING;
`;

  fs.writeFileSync('database.sql', sql, 'utf8');
  console.log('Wrote database.sql with bcrypt hash:', hash);
})();
