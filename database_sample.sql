-- ==========================================================
-- DATABASE: Pane e Amore (Full Verified Version)
-- DIALECT: PostgreSQL
-- Mật khẩu mặc định cho các tài khoản demo: 123
-- ==========================================================

BEGIN;

-- 1. XÓA BẢNG CŨ (Theo thứ tự an toàn)
DROP TABLE IF EXISTS orderline CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product CASCADE;
DROP TABLE IF EXISTS provider CASCADE;
DROP TABLE IF EXISTS category CASCADE;
DROP TABLE IF EXISTS manager CASCADE;
DROP TABLE IF EXISTS employee CASCADE;
DROP TABLE IF EXISTS customer CASCADE;
DROP TABLE IF EXISTS useraccount CASCADE;

-- ----------------------------------------------------------
-- 2. TẠO CẤU TRÚC BẢNG (SCHEMA)
-- ----------------------------------------------------------

CREATE TABLE useraccount (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role_id INTEGER NOT NULL CHECK (role_id IN (1, 2, 3)), -- 1: Client, 2: Staff, 3: Admin
    createdat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customer (
    user_id INTEGER PRIMARY KEY REFERENCES useraccount(id) ON DELETE CASCADE,
    fullname VARCHAR(100),
    address TEXT,
    dob DATE
);

CREATE TABLE employee (
    id INTEGER PRIMARY KEY, -- Mã nhân viên nhập tay (Ví dụ: 2001)
    user_id INTEGER UNIQUE NOT NULL REFERENCES useraccount(id) ON DELETE CASCADE,
    fullname VARCHAR(100),
    gender VARCHAR(10),
    avatar TEXT,
    address TEXT,
    department VARCHAR(50),
    manager_id INTEGER DEFAULT 1,
    hire_date DATE DEFAULT CURRENT_DATE,
    dob DATE,
    email VARCHAR(255)
);

CREATE TABLE manager (
    user_id INTEGER PRIMARY KEY REFERENCES useraccount(id) ON DELETE CASCADE,
    fullname VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    dob DATE,
    avatar TEXT,
    department VARCHAR(50)
);

CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE provider (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE product (
    id INTEGER PRIMARY KEY, -- SKU nhập tay
    name VARCHAR(255) NOT NULL,
    category_id INTEGER REFERENCES category(id) ON DELETE SET NULL,
    price DECIMAL(15, 2) NOT NULL DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    images TEXT,
    status VARCHAR(20) DEFAULT 'active',
    ingredients TEXT,
    nutrition_info JSONB,
    provide_id INTEGER REFERENCES provider(id) ON DELETE SET NULL
);

CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY, -- Sinh từ Date.now()
    customer_id INTEGER REFERENCES useraccount(id) ON DELETE SET NULL,
    employee_id INTEGER REFERENCES employee(id) ON DELETE SET NULL,
    total_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    payment VARCHAR(20),
    status VARCHAR(20) DEFAULT 'pending',
    orderdate DATE DEFAULT CURRENT_DATE,
    ordertime TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    receive_date DATE,
    receive_time VARCHAR(50),
    receive_address TEXT,
    receiver VARCHAR(100),
    receive_phone VARCHAR(20),
    note TEXT,
    employee_note TEXT
);

CREATE TABLE orderline (
    order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
    prod_id INTEGER REFERENCES product(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    orderdate DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (order_id, prod_id)
);

-- ----------------------------------------------------------
-- 3. NẠP DỮ LIỆU MẪU (SEED DATA)
-- ----------------------------------------------------------

-- 3.1. Nhà cung cấp & Danh mục
INSERT INTO provider (id, name) VALUES (1, 'Pane e Amore Main Factory');
INSERT INTO category (name, slug) VALUES 
('Bread', 'bread'), ('Cakes', 'cakes'), ('Coffee', 'coffee'), ('Milk', 'milk');

-- 3.2. Tài khoản Demo (Mật khẩu: 123) (trong seeder.js làm rồi)


-- 3.3. Sản phẩm mẫu
INSERT INTO product (id, name, category_id, price, stock, status, provide_id, description)
VALUES 
(101, 'Croissant', 1, 35000, 100, 'active', 1, 'Classic buttery flaky French pastry.'),
(102, 'Tiramisu Cake', 2, 250000, 20, 'active', 1, 'Authentic Italian coffee-flavored dessert.'),
(103, 'Arabica Espresso', 3, 45000, 500, 'active', 1, 'Rich and bold espresso shot.');

COMMIT;