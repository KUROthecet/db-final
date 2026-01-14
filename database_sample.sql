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

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> c76042bd05f32ce866a7c7b8178b3907dca305e7
-- 3.2. Tài khoản Demo (Mật khẩu: 654321) (trong seeder.js làm rồi)


-- 3.3. Sản phẩm mẫu
INSERT INTO product (id, name, category_id, price, stock, status, provide_id, description, images, ingredients, nutrition_info) 
VALUES 
-- Bread
(1001, 'Coconut Charcoal Croissant', 1, 45000.00, 100, 'active', 1, 'A unique charcoal-infused croissant featuring a rich and creamy coconut flavor.', '/BreadImages/Coconut-Charcoal-Croissant.png', 'Coconut, Milk, Charcoal', '{"calories": 285, "totalFat": 14, "saturatedFat": 9, "transFat": 1, "totalCarbs": 32, "totalSugar": 8, "protein": 6}'::jsonb),
(1002, 'Corn Sausage Croissant', 1, 48000.00, 100, 'active', 1, 'A savory croissant filled with juicy sausage, sweet corn, and melted cheese for a perfect breakfast.', '/BreadImages/Corn-Sausage-Croissant.png', 'Sausage, Corn, Cheese, Egg', '{"calories": 350, "totalFat": 22, "saturatedFat": 12, "transFat": 0.5, "totalCarbs": 28, "totalSugar": 4, "protein": 12}'::jsonb),
(1003, 'Cream Cheese Brioche', 1, 42000.00, 100, 'active', 1, 'A buttery and soft brioche bread filled with a rich, velvety cream cheese center.', '/BreadImages/Cream-Cheese-Brioche.png', 'Creamcheese, Egg, Milk', '{"calories": 310, "totalFat": 16, "saturatedFat": 9, "transFat": 0.5, "totalCarbs": 34, "totalSugar": 7, "protein": 8}'::jsonb),
(1004, 'Cream Soboro', 1, 38000.00, 100, 'active', 1, 'A delightful Korean-style streusel bread topped with crunchy peanut crumble and filled with smooth fresh cream and chocolate.', '/BreadImages/Cream-Soboro.png', 'Chocolate, Peanut, Fresh cream , Egg', '{"calories": 385, "totalFat": 21, "saturatedFat": 11, "transFat": 0.5, "totalCarbs": 42, "totalSugar": 15, "protein": 9}'::jsonb),
(1005, 'Baguette', 1, 35000.00, 100, 'active', 1, 'A traditional French crusty bread made with natural levain for a complex flavor and airy interior.', '/BreadImages/Baguette.png', 'Flour, Levain, Water', '{"calories": 245, "totalFat": 1.5, "saturatedFat": 0.5, "transFat": 0.5, "totalCarbs": 48, "totalSugar": 1, "protein": 9}'::jsonb),
(1006, 'Crookie', 1, 52000.00, 100, 'active', 1, 'A trendy and decadent hybrid pastry combining a buttery, flaky croissant with chewy chocolate chip cookie dough.', '/BreadImages/Crookie.png', 'Butter, Egg, Chocolate', '{"calories": 410, "totalFat": 24, "saturatedFat": 14, "transFat": 0.5, "totalCarbs": 44, "totalSugar": 18, "protein": 6}'::jsonb),
(1007, 'Bánh Mỳ Bơ Tỏi Lý Sơn', 1, 45000.00, 100, 'active', 1, 'A flavorful Vietnamese-style baguette infused with aromatic Ly Son garlic, creamy cream cheese, and a rich buttery glaze.', '/BreadImages/Bánh-Mỳ-Bơ-Tỏi-Lý-Sơn.png', 'Garlic, Egg, Creamcheese', '{"calories": 340, "totalFat": 19, "saturatedFat": 11, "transFat": 0.5, "totalCarbs": 36, "totalSugar": 6, "protein": 8}'::jsonb),
(1008, 'Dark Chocolate Donut', 1, 35000.00, 100, 'active', 1, 'A decadent donut glazed with rich dark chocolate and drizzled with smooth milk chocolate for the ultimate cocoa experience.', '/BreadImages/Dark-Chocolate-Donut.png', 'Dark chocolate, Milk chocolate, Egg', '{"calories": 320, "totalFat": 18, "saturatedFat": 10, "transFat": 0.5, "totalCarbs": 38, "totalSugar": 18, "protein": 5}'::jsonb),
(1009, 'Chocolate Quay Quay', 1, 32000.00, 100, 'active', 1, 'A delightful twisted pastry coated in rich dark chocolate and made with a soft, milky dough.', '/BreadImages/Chocolate-Quay-Quay.png', 'Dark chocolate, Milk, Egg', '{"calories": 290, "totalFat": 15, "saturatedFat": 8, "transFat": 0.5, "totalCarbs": 35, "totalSugar": 14, "protein": 6}'::jsonb),
(1010, 'Diamant Croissant', 1, 48000.00, 100, 'active', 1, 'A luxurious croissant topped with a crunchy almond diamond crust, offering a rich buttery flavor and nutty aroma.', '/BreadImages/Diamant-Croissant.png', 'Almond, Milk, Butter', '{"calories": 365, "totalFat": 22, "saturatedFat": 12, "transFat": 0.5, "totalCarbs": 34, "totalSugar": 9, "protein": 7}'::jsonb),
(1011, 'Coffee Bun', 1, 35000.00, 100, 'active', 1, 'A soft and fluffy bun topped with a crisp, aromatic coffee-flavored crust and a hint of almond.', '/BreadImages/Coffee-Bun.png', 'Almond, Coffee, Butter, Egg', '{"calories": 310, "totalFat": 16, "saturatedFat": 9, "transFat": 0.5, "totalCarbs": 38, "totalSugar": 12, "protein": 6}'::jsonb),
(1012, 'Cream Twist Donut', 1, 35000.00, 100, 'active', 1, 'A light and airy twisted donut filled with velvety fresh cream and dusted with a touch of sweetness.', '/BreadImages/Cream-Twist-Donut.png', 'Fresh cream, Milk, Egg', '{"calories": 320, "totalFat": 18, "saturatedFat": 10, "transFat": 0.5, "totalCarbs": 36, "totalSugar": 14, "protein": 5}'::jsonb),
(1013, 'Dinosaur Eggs Bread', 1, 30000.00, 100, 'active', 1, 'A chewy and addictive Korean-style bread made with tapioca flour, toasted sesame seeds, and a hint of savory soy.', '/BreadImages/Dinosaur-Eggs-Bread.png', 'Sesame, Soy, Tapioca', '{"calories": 180, "totalFat": 7, "saturatedFat": 1.5, "transFat": 0.5, "totalCarbs": 26, "totalSugar": 5, "protein": 3}'::jsonb),
(1014, 'Croffle', 1, 38000.00, 100, 'active', 1, 'A delightful fusion of a croissant and a waffle, featuring a crispy, buttery exterior and a soft, layered interior.', '/BreadImages/Croffle.png', 'Butter, Egg, Milk', '{"calories": 295, "totalFat": 17, "saturatedFat": 10, "transFat": 0.5, "totalCarbs": 30, "totalSugar": 6, "protein": 5}'::jsonb),
(1015, 'Egg Tart Portugal', 1, 30000.00, 100, 'active', 1, 'A classic Portuguese-style tart featuring a flaky, caramelized crust and a rich, creamy egg custard center with a hint of vanilla.', '/BreadImages/Egg-Tart-Portugal.png', 'Egg, Fresh cream, Vanilla', '{"calories": 220, "totalFat": 14, "saturatedFat": 8, "transFat": 0.5, "totalCarbs": 19, "totalSugar": 11, "protein": 4}'::jsonb),
(1016, 'Cruncky Twist', 1, 35000.00, 100, 'active', 1, 'A crunchy twisted pastry packed with the nutty flavors of walnuts and cashews, filled with sweet red bean paste.', '/BreadImages/Cruncky-Twist.png', 'Walnut, Cashew nut, Redbean', '{"calories": 340, "totalFat": 18, "saturatedFat": 2.5, "transFat": 0.5, "totalCarbs": 39, "totalSugar": 12, "protein": 7}'::jsonb),
(1017, 'Fig Campagne', 1, 55000.00, 100, 'active', 1, 'A rustic and hearty sourdough-style bread loaded with sweet dried figs, crunchy walnuts, and tart cranberries.', '/BreadImages/Fig-Campagne.png', 'Fig, Walnut, Cranberry', '{"calories": 280, "totalFat": 9, "saturatedFat": 1, "transFat": 0.5, "totalCarbs": 46, "totalSugar": 14, "protein": 7}'::jsonb),
(1018, 'French Croissant', 1, 35000.00, 100, 'active', 1, 'A quintessential French pastry made with layers of high-quality butter for a flaky, golden-brown crust and a soft, airy center.', '/BreadImages/French-Croissant.png', 'Butter, Egg, Milk', '{"calories": 270, "totalFat": 16, "saturatedFat": 10, "transFat": 0.5, "totalCarbs": 26, "totalSugar": 5, "protein": 6}'::jsonb),
(1019, 'Curry Croquette', 1, 42000.00, 100, 'active', 1, 'A savory fried pastry with a crispy golden shell, filled with a flavorful blend of aromatic curry, sautéed onions, sausage, and egg.', '/BreadImages/Curry-Croquette.png', 'Onion, Curry, Sausage, Egg', '{"calories": 325, "totalFat": 19, "saturatedFat": 8, "transFat": 0.5, "totalCarbs": 31, "totalSugar": 4, "protein": 9}'::jsonb),
(1020, 'Garlic Baguette', 1, 45000.00, 100, 'active', 1, 'A classic crusty baguette sliced and generously smothered with a rich, aromatic blend of garlic butter and a touch of sweetness.', '/BreadImages/Garlic-Baguette.png', 'Garlic, Butter, Milk, Egg', '{"calories": 310, "totalFat": 17, "saturatedFat": 9, "transFat": 0.5, "totalCarbs": 34, "totalSugar": 5, "protein": 7}'::jsonb),
(1021, 'Dark Rye Toast', 1, 58000.00, 100, 'active', 1, 'A nutrient-dense and hearty toast made with authentic dark rye, packed with crunchy walnuts and healthy flaxseeds.', '/BreadImages/Dark-Rye-Toast.png', 'Walnut, Flaxseed, Drak rye', '{"calories": 250, "totalFat": 11, "saturatedFat": 1.5, "transFat": 0, "totalCarbs": 32, "totalSugar": 3, "protein": 8}'::jsonb),
(1022, 'G-Seven Mocha Cream Soboro', 1, 38000.00, 100, 'active', 1, 'A Korean-style streusel bread featuring a crunchy Soboro topping infused with G7 coffee and filled with a smooth mocha cream.', '/BreadImages/G-Seven-Mocha-Cream-Soboro.png', 'Coffee, Butter, Egg', '{"calories": 360, "totalFat": 18, "saturatedFat": 10, "transFat": 0.5, "totalCarbs": 42, "totalSugar": 16, "protein": 6}'::jsonb),
(1023, 'Glutinous Red Bean Donut', 1, 32000.00, 100, 'active', 1, 'A chewy, mochi-like donut made from glutinous rice flour, filled with a sweet and smooth red bean paste.', '/BreadImages/Glutinous-Red-Bean-Donut.png', 'Glutinous rice, Redbean, Sugar', '{"calories": 285, "totalFat": 9, "saturatedFat": 2, "transFat": 0, "totalCarbs": 48, "totalSugar": 16, "protein": 4}'::jsonb),
(1024, 'Glutinous Rice Donut', 1, 28000.00, 100, 'active', 1, 'A delightfully chewy and sweet snack made from glutinous rice flour, fried to golden perfection and coated in a light dusting of sugar.', '/BreadImages/Glutinous-Rice-Donut.png', 'Sugar, Glutinous rice', '{"calories": 240, "totalFat": 8, "saturatedFat": 1.5, "transFat": 0, "totalCarbs": 39, "totalSugar": 12, "protein": 3}'::jsonb),
(1025, 'Honey Toast', 1, 42000.00, 100, 'active', 1, 'Thick-cut, fluffy bread soaked in a rich mixture of milk and egg, toasted until golden and finished with a generous drizzle of sweet honey.', '/BreadImages/Honey-Toast.png', 'Milk, Egg, Honey', '{"calories": 310, "totalFat": 12, "saturatedFat": 7, "transFat": 0.5, "totalCarbs": 44, "totalSugar": 18, "protein": 7}'::jsonb),
(1026, 'Kouign Amann', 1, 40000.00, 100, 'active', 1, 'A traditional Breton pastry featuring multiple layers of buttery dough and sugar, baked until caramelized for a perfect balance of salty and sweet.', '/BreadImages/Kouign-Amann.png', 'Sugar, Butter, Milk', '{"calories": 350, "totalFat": 22, "saturatedFat": 14, "transFat": 0.5, "totalCarbs": 36, "totalSugar": 18, "protein": 4}'::jsonb),
(1027, 'Honey Baguette', 1, 45000.00, 100, 'active', 1, 'A crisp on the outside, soft on the inside baguette infused with the natural sweetness of honey and enriched with milk and egg.', '/BreadImages/Honey-Baguette.png', 'Egg, Honey, Milk', '{"calories": 290, "totalFat": 10, "saturatedFat": 5, "transFat": 0.5, "totalCarbs": 42, "totalSugar": 14, "protein": 7}'::jsonb),
(1028, 'Jalapeno', 1, 48000.00, 100, 'active', 1, 'A savory and spicy pastry featuring zesty jalapenos, briny olives, and flavorful sausage for a bold taste experience.', '/BreadImages/Jalapeno.png', 'Jalapeno, Olive, Sausage', '{"calories": 330, "totalFat": 21, "saturatedFat": 9, "transFat": 0.5, "totalCarbs": 24, "totalSugar": 3, "protein": 11}'::jsonb),
(1029, 'Maple Flat Croissant', 1, 38000.00, 100, 'active', 1, 'A modern twist on the classic croissant, flattened and baked to a crisp perfection with a sweet glaze of pure maple syrup and rich butter.', '/BreadImages/Maple-Flat-Croissant.png', 'Butter, Egg, Maple syrup', '{"calories": 280, "totalFat": 15, "saturatedFat": 9, "transFat": 0.5, "totalCarbs": 32, "totalSugar": 12, "protein": 4}'::jsonb),
(1030, 'Kimchi Croquette', 1, 42000.00, 100, 'active', 1, 'A fusion delight featuring a crispy golden crust filled with a spicy and savory mix of traditional kimchi, sausage, and soft potato.', '/BreadImages/Kimchi-Croquette.png', 'Kimchi, Sausage, Potato, Egg', '{"calories": 315, "totalFat": 18, "saturatedFat": 7, "transFat": 0.5, "totalCarbs": 29, "totalSugar": 5, "protein": 9}'::jsonb),
(1031, 'Olive Ciabatta', 1, 45000.00, 100, 'active', 1, 'A Mediterranean-style bread featuring a porous, chewy texture infused with savory olives and soft potato for added moisture.', '/BreadImages/Olive-Ciabatta.png', 'Olive, Potato', '{"calories": 210, "totalFat": 7, "saturatedFat": 1, "transFat": 0, "totalCarbs": 32, "totalSugar": 2, "protein": 6}'::jsonb), 
(1032, 'Mont Blanc 1', 1, 52000.00, 100, 'active', 1, 'A classic sweet pastry with delicate, buttery layers that spiral upward, offering a light and airy texture enriched with milk and egg.', '/BreadImages/Mont-Blanc-1.png', 'Butter, Egg, Milk', '{"calories": 380, "totalFat": 24, "saturatedFat": 15, "transFat": 0.5, "totalCarbs": 36, "totalSugar": 14, "protein": 5}'::jsonb), 
(1033, 'Olive Tangzong Toast', 1, 55000.00, 100, 'active', 1, 'An exceptionally soft and springy toast made using the Tangzhong method, studded with savory olives and rich cheese.', '/BreadImages/Olive-Tangzong-Toast.png', 'Olive, Tangzhong, Cheese', '{"calories": 290, "totalFat": 14, "saturatedFat": 6, "transFat": 0.5, "totalCarbs": 33, "totalSugar": 4, "protein": 9}'::jsonb),
(1034, 'Onion Sausage Pizza', 1, 48000.00, 100, 'active', 1, 'A savory snack pizza topped with flavorful sausage, zesty onions, olives, and egg for a satisfying bite.', '/BreadImages/Onion-Sausage-Pizza.png', 'Sausage, Olive, Onion, Egg', '{"calories": 360, "totalFat": 22, "saturatedFat": 9, "transFat": 0.5, "totalCarbs": 28, "totalSugar": 5, "protein": 12}'::jsonb), 
(1035, 'Milk Toast', 1, 42000.00, 100, 'active', 1, 'A soft and creamy loaf made with a high proportion of milk and butter, perfect for a gentle morning toast.', '/BreadImages/Milk-Toast.png', 'Milk, Egg, Butter', '{"calories": 260, "totalFat": 12, "saturatedFat": 7, "transFat": 0.5, "totalCarbs": 32, "totalSugar": 6, "protein": 7}'::jsonb), 
(1036, 'Mini Croissant', 1, 15000.00, 100, 'active', 1, 'A bite-sized version of the classic French pastry, maintaining all the buttery, flaky layers in a smaller form.', '/BreadImages/Mini-Croissant.png', 'Butter, Egg, Milk', '{"calories": 140, "totalFat": 8, "saturatedFat": 5, "transFat": 0.3, "totalCarbs": 13, "totalSugar": 2, "protein": 3}'::jsonb), 
(1037, 'Original Glazed Donut', 1, 28000.00, 100, 'active', 1, 'A light and airy yeast-raised donut finished with a signature smooth sugar powder glaze.', '/BreadImages/Original-Glazed-Donut.png', 'Sugar powder, milk, butter', '{"calories": 210, "totalFat": 11, "saturatedFat": 5, "transFat": 0, "totalCarbs": 25, "totalSugar": 12, "protein": 3}'::jsonb), 
(1038, 'Pain aux raisins', 1, 45000.00, 100, 'active', 1, 'A classic spiral pastry filled with sweet pastry cream, plump raisins, and a hint of almond flavor.', '/BreadImages/Pain-aux-raisins.png', 'Raisin, Almond, Milk, Butter', '{"calories": 320, "totalFat": 15, "saturatedFat": 9, "transFat": 0.5, "totalCarbs": 42, "totalSugar": 18, "protein": 6}'::jsonb), 
(1039, 'Mont Blanc 2', 1, 52000.00, 100, 'active', 1, 'A tall, elegant pastry with spiraling layers of buttery dough, rich in milk and egg flavor.', '/BreadImages/Mont-Blanc-2.png', 'Butter, Egg, Milk', '{"calories": 380, "totalFat": 24, "saturatedFat": 15, "transFat": 0.5, "totalCarbs": 36, "totalSugar": 14, "protein": 5}'::jsonb), 
(1040, 'Natural Campagne', 1, 55000.00, 100, 'active', 1, 'A wholesome country-style bread made with wholemeal flour, featuring crunchy walnuts and sweet-tart cranberries.', '/BreadImages/Natural-Campagne.png', 'Walnut, Wholemeal, Cranberry', '{"calories": 260, "totalFat": 8, "saturatedFat": 1, "transFat": 0, "totalCarbs": 44, "totalSugar": 10, "protein": 8}'::jsonb), 
(1041, 'Pea Bean Bread', 1, 35000.00, 100, 'active', 1, 'A unique and slightly sweet bread filled with tender green peas, offering a soft texture from milk and egg.', '/BreadImages/Pea-Bean-Bread.png', 'Grean pea, Egg, Milk', '{"calories": 280, "totalFat": 9, "saturatedFat": 4, "transFat": 0, "totalCarbs": 43, "totalSugar": 12, "protein": 8}'::jsonb), 
(1042, 'Plain Bagel', 1, 30000.00, 100, 'active', 1, 'A traditionally boiled and baked bagel with a chewy texture and a subtle hint of olive oil.', '/BreadImages/Plain-Bagel.png', 'Flour, Water, Olive oil', '{"calories": 250, "totalFat": 3, "saturatedFat": 0.5, "transFat": 0, "totalCarbs": 48, "totalSugar": 4, "protein": 9}'::jsonb),
(1043, 'Onion Cream Cheese Pretzel', 1, 48000.00, 100, 'active', 1, 'A soft, chewy pretzel filled with a savory blend of smooth cream cheese and zesty onions, accented with a hint of mustard.', '/BreadImages/Onion-Cream-Cheese-Pretzel.png', 'Cream cheese, Mustard, Onion', '{"calories": 340, "totalFat": 18, "saturatedFat": 10, "transFat": 0.5, "totalCarbs": 38, "totalSugar": 7, "protein": 8}'::jsonb), 
(1044, 'Red Pepper Sausage', 1, 45000.00, 100, 'active', 1, 'A spicy and savory bread featuring a juicy sausage glazed with authentic Korean chile sauce and aromatic garlic.', '/BreadImages/Red-Pepper-Sausage.png', 'Sausage, Korean chile sauce, Garlic, Egg', '{"calories": 310, "totalFat": 17, "saturatedFat": 6, "transFat": 0.5, "totalCarbs": 29, "totalSugar": 6, "protein": 11}'::jsonb), 
(1045, 'Palmier Carre', 1, 42000.00, 100, 'active', 1, 'Crispy, multi-layered puff pastry squares caramelized with sugar and dipped in decadent, rich dark chocolate.', '/BreadImages/Palmier-Carre.png', 'Butter, Sugar, Dark chocolat', '{"calories": 290, "totalFat": 18, "saturatedFat": 12, "transFat": 0.5, "totalCarbs": 30, "totalSugar": 15, "protein": 3}'::jsonb), 
(1046, 'Snow Bean Cream', 1, 38000.00, 100, 'active', 1, 'A delightful fusion of light, airy fresh cream and sweet red bean paste inside a soft, pillowy bun.', '/BreadImages/Snow-Bean-Cream.png', 'Fresh cream, Red bean, Egg', '{"calories": 320, "totalFat": 14, "saturatedFat": 8, "transFat": 0.5, "totalCarbs": 42, "totalSugar": 19, "protein": 6}'::jsonb), 
(1047, 'Patisserie Cream Bread', 1, 35000.00, 100, 'active', 1, 'A classic bakery favorite filled with smooth, velvety custard cream made from fresh milk and farm eggs.', '/BreadImages/Patisserie-Cream-Bread.png', 'Milk, Egg, Butter', '{"calories": 280, "totalFat": 12, "saturatedFat": 7, "transFat": 0.5, "totalCarbs": 37, "totalSugar": 14, "protein": 6}'::jsonb), 
(1048, 'Snow Milk Cream Bun', 1, 36000.00, 100, 'active', 1, 'A soft bun overflowing with a rich and milky sweet cream, dusted lightly for a snowy, elegant finish.', '/BreadImages/Snow-Milk-Cream-Bun.png', 'Milk, Butter, Sugar', '{"calories": 310, "totalFat": 15, "saturatedFat": 9, "transFat": 0.5, "totalCarbs": 38, "totalSugar": 16, "protein": 5}'::jsonb), 
(1049, 'Petite Roll Cheese Bread', 1, 32000.00, 100, 'active', 1, 'Small, bite-sized savory rolls baked with a generous amount of cheese for a salty and satisfying snack.', '/BreadImages/Petite-Roll-Cheese-Bread.png', 'Cheese, Flour, Water', '{"calories": 180, "totalFat": 9, "saturatedFat": 5, "transFat": 0.3, "totalCarbs": 18, "totalSugar": 1, "protein": 7}'::jsonb), 
(1050, 'Sweet potato Patissier cream Toast', 1, 46000.00, 100, 'active', 1, 'A delicious toast topped with sweet potato mash and pastry cream, finished with a sprinkle of nutty black sesame seeds.', '/BreadImages/Sweet-potato-Patissier-cream-Toast.png', 'Patisserie cream, Sweet potato, Black sesame', '{"calories": 330, "totalFat": 11, "saturatedFat": 5, "transFat": 0.4, "totalCarbs": 52, "totalSugar": 18, "protein": 6}'::jsonb), 
(1051, 'Plain Scone', 1, 30000.00, 100, 'active', 1, 'A traditional buttery scone with a crumbly texture, perfect when paired with jam or tea.', '/BreadImages/Plain-Scone.png', 'Butter, Milk, Egg', '{"calories": 310, "totalFat": 16, "saturatedFat": 10, "transFat": 0.5, "totalCarbs": 36, "totalSugar": 8, "protein": 5}'::jsonb),

-- Cakes
(2000, 'STRAWBERRY CAKE', 2, 65000.00, 100, 'active', 1, 'A delightful and classic cake featuring layers of moist sponge, fresh whipped cream, and succulent strawberries.', '/CakeImages/STRAWBERRY-CAKE.jpg', 'Flour, Sugar, Eggs, Fresh Strawberries, Whipped Cream', '{"calories": 320, "totalFat": 14.25, "saturatedFat": 8.12, "transFat": 0.04, "totalCarbs": 42.56, "totalSugar": 28.15, "protein": 4.32}'::jsonb),
(2001, 'FRUIT CAKE', 2, 75000.00, 100, 'active', 1, 'A rich and dense cake packed with a vibrant assortment of candied fruits, nuts, and aromatic spices for a traditional festive flavor.', '/CakeImages/FRUIT-CAKE.jpg', 'Flour, Mixed Candied Fruits, Walnuts, Raisins, Eggs, Butter, Spices', '{"calories": 385, "totalFat": 12.45, "saturatedFat": 6.18, "transFat": 0.05, "totalCarbs": 62.14, "totalSugar": 45.32, "protein": 5.21}'::jsonb), 
(2002, 'NUTELLA CAKE', 2, 85000.00, 100, 'active', 1, 'An indulgent chocolate hazelnut dream featuring layers of velvety Nutella frosting and soft cocoa sponge cake.', '/CakeImages/NUTELLA-CAKE.jpg', 'Nutella, Dark Chocolate, Flour, Hazelnuts, Eggs, Butter, Cocoa Powder', '{"calories": 450, "totalFat": 26.74, "saturatedFat": 11.32, "transFat": 0.08, "totalCarbs": 48.91, "totalSugar": 34.56, "protein": 6.84}'::jsonb),
(2003, 'FERRERO ROCHER CAKE', 2, 95000.00, 100, 'active', 1, 'A luxurious multi-layered cake featuring hazelnut praline, rich chocolate ganache, and crunchy Ferrero Rocher pieces.', '/CakeImages/FERRERO-ROCHER-CAKE.jpg', 'Hazelnuts, Milk Chocolate, Wafer, Flour, Eggs, Butter, Nutella', '{"calories": 480, "totalFat": 32.15, "saturatedFat": 14.56, "transFat": 0.12, "totalCarbs": 44.23, "totalSugar": 32.18, "protein": 7.45}'::jsonb), 
(2004, 'HOMEMADE CHOCOLATE CAKE', 2, 60000.00, 100, 'active', 1, 'A nostalgic, moist chocolate cake made with simple, high-quality ingredients just like at home.', '/CakeImages/HOMEMADE-CHOCOLATE-CAKE.jpg', 'Cocoa Powder, Flour, Sugar, Milk, Eggs, Vanilla Extract, Vegetable Oil', '{"calories": 350, "totalFat": 16.42, "saturatedFat": 7.89, "transFat": 0.03, "totalCarbs": 46.75, "totalSugar": 29.41, "protein": 5.12}'::jsonb), 
(2005, 'CHOCOLATE CHIPS CAKE', 2, 55000.00, 100, 'active', 1, 'A soft and fluffy sponge cake studded with generous amounts of premium semi-sweet chocolate chips.', '/CakeImages/CHOCOLATE-CHIPS-CAKE.jpg', 'Flour, Dark Chocolate Chips, Butter, Sugar, Eggs, Baking Powder', '{"calories": 310, "totalFat": 14.88, "saturatedFat": 8.24, "transFat": 0.05, "totalCarbs": 41.36, "totalSugar": 22.09, "protein": 4.88}'::jsonb), 
(2006, 'CHOCOLATE BOMP CAKE', 2, 80000.00, 100, 'active', 1, 'An explosion of chocolate flavor with a molten core or rich truffle filling that melts in your mouth.', '/CakeImages/CHOCOLATE-BOMP-CAKE.jpg', 'Dark Chocolate, Heavy Cream, Eggs, Flour, Cocoa Butter, Sugar', '{"calories": 420, "totalFat": 28.34, "saturatedFat": 15.67, "transFat": 0.09, "totalCarbs": 38.12, "totalSugar": 26.45, "protein": 5.76}'::jsonb), 
(2007, 'DATE CAKE', 2, 50000.00, 100, 'active', 1, 'A naturally sweet and moist cake made with premium dates, often served with a hint of caramel or honey.', '/CakeImages/DATE-CAKE.jpg', 'Dried Dates, Flour, Brown Sugar, Eggs, Walnuts, Cinnamon, Butter', '{"calories": 290, "totalFat": 9.15, "saturatedFat": 4.23, "transFat": 0.02, "totalCarbs": 51.48, "totalSugar": 36.12, "protein": 4.25}'::jsonb), 
(2008, 'CROQUANT CAKE', 2, 70000.00, 100, 'active', 1, 'A sophisticated cake featuring a crunchy almond or hazelnut croquant layer for a delightful contrast in textures.', '/CakeImages/CROQUANT-CAKE.jpg', 'Almonds, Caramelized Sugar, Pastry Cream, Flour, Butter, Eggs', '{"calories": 370, "totalFat": 19.54, "saturatedFat": 9.32, "transFat": 0.06, "totalCarbs": 45.18, "totalSugar": 27.85, "protein": 6.14}'::jsonb),

-- Coffee
(3000, 'Phin C1+', 3, 120000.00, 100, 'active', 1, 'A strong and traditional Vietnamese blend featuring 70% bold Robusta and 30% aromatic Arabica for a perfectly balanced Phin coffee experience.', '/CoffeeImages/Phin-C1+.jpg', '70% Robusta, 30% Arabica', '{"calories": 4, "totalFat": 0.12, "saturatedFat": 0.04, "transFat": 0.001, "totalCarbs": 0.65, "totalSugar": 0.08, "protein": 0.35}'::jsonb), 
(3001, 'HONEY MOON', 3, 185000.00, 100, 'active', 1, 'A sweet and delicate blend of Caturra and Catuai beans, offering a clean cup with lingering notes of honey and soft citrus.', '/CoffeeImages/HONEY-MOON.jpg', 'Caturra coffee beans, Catuai coffee beans', '{"calories": 3, "totalFat": 0.09, "saturatedFat": 0.02, "transFat": 0.002, "totalCarbs": 0.42, "totalSugar": 0.15, "protein": 0.28}'::jsonb), 
(3002, 'DANCING BEAN', 3, 210000.00, 100, 'active', 1, 'Experience the vibrant energy of 74158 variety beans, characterized by a lively acidity and a rhythmic complexity in every sip.', '/CoffeeImages/DANCING-BEAN.jpg', '74158 coffee beans', '{"calories": 2, "totalFat": 0.15, "saturatedFat": 0.05, "transFat": 0.001, "totalCarbs": 0.38, "totalSugar": 0.11, "protein": 0.31}'::jsonb), 
(3003, 'BERRY POM', 3, 195000.00, 100, 'active', 1, 'Wild Heirloom beans deliver a sophisticated profile with intense notes of dark berries and tart pomegranate.', '/CoffeeImages/BERRY-POM.jpg', 'Heirloom coffee beans', '{"calories": 3, "totalFat": 0.11, "saturatedFat": 0.03, "transFat": 0.001, "totalCarbs": 0.55, "totalSugar": 0.22, "protein": 0.29}'::jsonb), 
(3004, 'DARK BERRY LUXE', 3, 225000.00, 100, 'active', 1, 'A luxurious African-inspired blend of SL28, SL34, Ruiru, and Batian beans, offering a deep, velvety body with rich forest fruit undertones.', '/CoffeeImages/DARK-BERRY-LUXE.jpg', 'SL28 coffee beans, SL34 coffee beans, Ruiru coffee beans, Batian coffee beans', '{"calories": 5, "totalFat": 0.18, "saturatedFat": 0.06, "transFat": 0.003, "totalCarbs": 0.72, "totalSugar": 0.19, "protein": 0.45}'::jsonb), 
(3005, 'BERRY CREAM', 3, 180000.00, 100, 'active', 1, 'Soft Heirloom beans processed to highlight a smooth, creamy mouthfeel paired with a gentle strawberry-like sweetness.', '/CoffeeImages/BERRY-CREAM.jpg', 'Heirloom coffee beans', '{"calories": 4, "totalFat": 0.21, "saturatedFat": 0.08, "transFat": 0.002, "totalCarbs": 0.48, "totalSugar": 0.31, "protein": 0.33}'::jsonb), 
(3006, 'CREAMY', 3, 145000.00, 100, 'active', 1, 'A premium Fine Robusta that challenges expectations, delivering a heavy, buttery body with a clean, nutty finish.', '/CoffeeImages/CREAMY.jpg', 'Fine Robusta coffee beans', '{"calories": 6, "totalFat": 0.25, "saturatedFat": 0.11, "transFat": 0.004, "totalCarbs": 0.82, "totalSugar": 0.05, "protein": 0.52}'::jsonb), 
(3007, 'CHOCO STRAWBERRY', 3, 160000.00, 100, 'active', 1, 'Unique Robusta Búp Tím beans naturally present a nostalgic flavor profile reminiscent of dark chocolate-covered strawberries.', '/CoffeeImages/CHOCO-STRAWBERRY.jpg', 'Robusta Búp Tím coffee beans', '{"calories": 4, "totalFat": 0.19, "saturatedFat": 0.07, "transFat": 0.001, "totalCarbs": 0.58, "totalSugar": 0.25, "protein": 0.39}'::jsonb), 
(3008, 'COLOMBIA SUPREMO', 3, 175000.00, 100, 'active', 1, 'Classic Catuai beans harvested at peak ripeness, offering a quintessential Colombian profile with caramel sweetness and a medium body.', '/CoffeeImages/COLOMBIA-SUPREMO.jpg', 'Catuai coffee beans', '{"calories": 3, "totalFat": 0.14, "saturatedFat": 0.04, "transFat": 0.001, "totalCarbs": 0.45, "totalSugar": 0.12, "protein": 0.32}'::jsonb), 
(3009, 'GOLDEN BRIGHT', 3, 190000.00, 100, 'active', 1, 'Luminous Heirloom coffee beans that shine with a crisp, sparkling acidity and bright floral aromas.', '/CoffeeImages/GOLDEN-BRIGHT.jpg', 'Heirloom coffee beans', '{"calories": 2, "totalFat": 0.08, "saturatedFat": 0.02, "transFat": 0.001, "totalCarbs": 0.39, "totalSugar": 0.18, "protein": 0.26}'::jsonb),
(3010, 'LYCHEE BRANDY FUSION', 3, 215000.00, 100, 'active', 1, 'An exotic fusion of Caturra and Catuai beans, offering an intense aromatic profile of sweet lychee and a sophisticated brandy-like finish.', '/CoffeeImages/LYCHEE-BRANDY-FUSION.jpg', 'Caturra coffee beans, Catuai coffee beans', '{"calories": 4, "totalFat": 0.16, "saturatedFat": 0.05, "transFat": 0.002, "totalCarbs": 0.62, "totalSugar": 0.28, "protein": 0.34}'::jsonb), 
(3011, 'PEACHY BEACH', 3, 195000.00, 100, 'active', 1, 'Sun-kissed Heirloom coffee beans that deliver a refreshing and bright acidity with prominent notes of ripe peach and summer blossoms.', '/CoffeeImages/PEACHY-BEACH.jpg', 'Heirloom coffee beans', '{"calories": 3, "totalFat": 0.11, "saturatedFat": 0.03, "transFat": 0.001, "totalCarbs": 0.44, "totalSugar": 0.21, "protein": 0.29}'::jsonb), 
(3012, 'LYCHEE WINE BLOOM', 3, 230000.00, 100, 'active', 1, 'Carefully fermented Castillo beans resulting in a rich, winey texture and a floral bouquet of blooming lychees.', '/CoffeeImages/LYCHEE-WINE-BLOOM.jpg', 'Castillo coffee beans', '{"calories": 5, "totalFat": 0.14, "saturatedFat": 0.04, "transFat": 0.003, "totalCarbs": 0.75, "totalSugar": 0.32, "protein": 0.41}'::jsonb), 
(3013, 'MELLOW', 3, 135000.00, 100, 'active', 1, 'A smooth and approachable Catimor blend, perfectly roasted to provide a balanced, mellow cup with low acidity and a clean finish.', '/CoffeeImages/MELLOW.jpg', 'Catimor coffee beans', '{"calories": 4, "totalFat": 0.22, "saturatedFat": 0.09, "transFat": 0.005, "totalCarbs": 0.52, "totalSugar": 0.06, "protein": 0.38}'::jsonb), 
(3014, 'MELODY OF BERRIES', 3, 220000.00, 100, 'active', 1, 'A harmonious blend of SL28 and SL34 beans, singing with a multi-layered berry sweetness and a crisp, orchestral acidity.', '/CoffeeImages/MELODY-OF-BERRIES.jpg', 'SL28 coffee beans, SL34 coffee beans', '{"calories": 3, "totalFat": 0.13, "saturatedFat": 0.04, "transFat": 0.001, "totalCarbs": 0.58, "totalSugar": 0.19, "protein": 0.31}'::jsonb), 
(3015, 'LẠC DƯƠNG (NATURAL)', 3, 170000.00, 100, 'active', 1, 'A natural process highland blend from Lac Duong, showcasing the raw sweetness and fruity complexity of Caturra, Catuai, and Typica.', '/CoffeeImages/LẠC-DƯƠNG-(NATURAL).jpg', 'Caturra coffee beans, Catuai coffee beans, Typica coffee beans', '{"calories": 4, "totalFat": 0.18, "saturatedFat": 0.06, "transFat": 0.002, "totalCarbs": 0.69, "totalSugar": 0.24, "protein": 0.37}'::jsonb), 
(3016, 'LẠC DƯƠNG (WASHED)', 3, 160000.00, 100, 'active', 1, 'A clean and bright washed coffee from Lac Duong, highlighting the crisp citrus and nutty profiles of Catimor, Typica, and Catuai.', '/CoffeeImages/LẠC-DƯƠNG-(WASHED).jpg', 'Catimor coffee beans, Typica coffee beans, Catuai coffee beans', '{"calories": 3, "totalFat": 0.12, "saturatedFat": 0.03, "transFat": 0.001, "totalCarbs": 0.49, "totalSugar": 0.14, "protein": 0.33}'::jsonb), 
(3017, 'MELTY PLUM', 3, 185000.00, 100, 'active', 1, 'A succulent blend of Catuai and Caturra beans with a jammy mouthfeel and deep, melting plum sweetness.', '/CoffeeImages/MELTY-PLUM.jpg', 'Catuai coffee beans, Caturra coffee beans', '{"calories": 4, "totalFat": 0.15, "saturatedFat": 0.05, "transFat": 0.002, "totalCarbs": 0.64, "totalSugar": 0.27, "protein": 0.35}'::jsonb), 
(3018, 'PASSION POM', 3, 205000.00, 100, 'active', 1, 'Vibrant Heirloom beans that burst with tropical passionfruit energy and the tart complexity of red pomegranate.', '/CoffeeImages/PASSION-POM.jpg', 'Heirloom coffee beans', '{"calories": 3, "totalFat": 0.10, "saturatedFat": 0.02, "transFat": 0.001, "totalCarbs": 0.51, "totalSugar": 0.23, "protein": 0.28}'::jsonb), 
(3019, 'PHIN ĐẬM', 3, 110000.00, 100, 'active', 1, 'For lovers of traditional Vietnamese coffee, this 100% Robusta Sẻ blend offers an intensely bold, nutty, and chocolatey profile.', '/CoffeeImages/PHIN-ĐẬM.jpg', 'Robusta Sẻ coffee beans', '{"calories": 6, "totalFat": 0.28, "saturatedFat": 0.12, "transFat": 0.004, "totalCarbs": 0.88, "totalSugar": 0.04, "protein": 0.56}'::jsonb),
(3020, 'RUBY KISSY', 3, 215000.00, 100, 'active', 1, 'An exquisite selection of 74112 beans from Cuiji and Uraga, offering a sparkling acidity and deep ruby fruit notes.', '/CoffeeImages/RUBY-KISSY.jpg', '74112 coffee beans, Cuiji, Uraga origin', '{"calories": 3, "totalFat": 0.14, "saturatedFat": 0.04, "transFat": 0.001, "totalCarbs": 0.52, "totalSugar": 0.18, "protein": 0.32}'::jsonb), 
(3021, 'JAVA LẠC DƯƠNG', 3, 195000.00, 100, 'active', 1, 'Distinctive Java variety beans grown in the highlands of Lac Duong, showcasing a delicate floral aroma and a silky body.', '/CoffeeImages/JAVA-LẠC-DƯƠNG.jpg', 'Java coffee beans, Lạc Dương, Lâm Đồng origin', '{"calories": 4, "totalFat": 0.11, "saturatedFat": 0.03, "transFat": 0.002, "totalCarbs": 0.47, "totalSugar": 0.14, "protein": 0.36}'::jsonb), 
(3022, 'RAISIN HONEY', 3, 185000.00, 100, 'active', 1, 'Yellow Bourbon beans from Don Duong processed with the honey method to produce intense raisin sweetness and a syrupy mouthfeel.', '/CoffeeImages/RAISIN-HONEY.jpg', 'Yellow Bourbon coffee beans, Đơn Dương, Lâm Đồng origin', '{"calories": 5, "totalFat": 0.17, "saturatedFat": 0.06, "transFat": 0.001, "totalCarbs": 0.76, "totalSugar": 0.35, "protein": 0.31}'::jsonb), 
(3023, 'WHISKY DROPS', 3, 240000.00, 100, 'active', 1, 'A bold Honduran blend from Masaguara, featuring anaerobic fermentation notes reminiscent of fine whisky and dark cocoa.', '/CoffeeImages/WHISKY-DROPS.jpg', 'Caturra coffee beans, Catuai coffee beans, Masaguara origin', '{"calories": 4, "totalFat": 0.19, "saturatedFat": 0.07, "transFat": 0.003, "totalCarbs": 0.61, "totalSugar": 0.09, "protein": 0.42}'::jsonb), 
(3024, 'TROPICAL BREEZE', 3, 210000.00, 100, 'active', 1, 'Classic Yigacheffe Heirloom beans that carry a refreshing breeze of jasmine tea and tropical citrus notes.', '/CoffeeImages/TROPICAL-BREEZE.jpg', 'Heirloom coffee beans, Yigacheffe origin', '{"calories": 2, "totalFat": 0.09, "saturatedFat": 0.02, "transFat": 0.001, "totalCarbs": 0.39, "totalSugar": 0.15, "protein": 0.28}'::jsonb), 
(3025, 'TANGY TANGY', 3, 205000.00, 100, 'active', 1, 'Vibrant Guji beans characterized by a double-tangy lemon and bergamot acidity with a clean, lingering finish.', '/CoffeeImages/TANGY-TANGY.jpg', 'Heirloom coffee beans, Guji origin', '{"calories": 3, "totalFat": 0.12, "saturatedFat": 0.03, "transFat": 0.001, "totalCarbs": 0.54, "totalSugar": 0.21, "protein": 0.33}'::jsonb), 
(3026, 'TROPICAL GARDEN', 3, 190000.00, 100, 'active', 1, 'A balanced Costa Rican selection from Tarrazu, offering a bouquet of garden florals and sweet stone fruit flavors.', '/CoffeeImages/TROPICAL-GARDEN.jpg', 'Catuai coffee beans, Caturra coffee beans, Tarrazu, Costa Rica origin', '{"calories": 4, "totalFat": 0.15, "saturatedFat": 0.05, "transFat": 0.002, "totalCarbs": 0.49, "totalSugar": 0.17, "protein": 0.35}'::jsonb), 
(3027, 'YELLOW BOURBON', 3, 180000.00, 100, 'active', 1, 'Pure Yellow Bourbon beans from Lac Duong, celebrated for their creamy texture and elegant nutty-caramel sweetness.', '/CoffeeImages/YELLOW-BOURBON.jpg', 'Yellow Bourbon coffee beans, Lạc Dương, Lâm Đồng origin', '{"calories": 4, "totalFat": 0.21, "saturatedFat": 0.08, "transFat": 0.004, "totalCarbs": 0.58, "totalSugar": 0.12, "protein": 0.38}'::jsonb), 
(3028, 'RO 80+', 3, 130000.00, 100, 'active', 1, 'High-scoring Fine Robusta from the Central Highlands, delivering a powerful yet clean cup with notes of toasted cereals and dark chocolate.', '/CoffeeImages/RO-80+.jpg', 'Fine Robusta coffee beans, Lâm Đồng, Gia Lai origin', '{"calories": 6, "totalFat": 0.26, "saturatedFat": 0.11, "transFat": 0.005, "totalCarbs": 0.84, "totalSugar": 0.03, "protein": 0.51}'::jsonb), 
(3029, 'RUM SHOTS', 3, 250000.00, 100, 'active', 1, 'Intense Colombian beans from Huila with a unique fermentation process that mimics the spicy, oaky warmth of aged rum.', '/CoffeeImages/RUM-SHOTS.jpg', 'Caturra coffee beans, Bourbon coffee beans, Huila origin', '{"calories": 5, "totalFat": 0.18, "saturatedFat": 0.06, "transFat": 0.003, "totalCarbs": 0.68, "totalSugar": 0.11, "protein": 0.45}'::jsonb),
(3030, 'RED VELVET STRAWBERRY', 3, 235000.00, 100, 'active', 1, 'A stunning Castillo coffee from Quindío, featuring a creamy mouthfeel and intense natural strawberry notes reminiscent of a decadent red velvet cake.', '/CoffeeImages/RED-VELVET-STRAWBERRY.jpg', 'Castillo coffee beans, Quindío origin', '{"calories": 4, "totalFat": 0.17, "saturatedFat": 0.05, "transFat": 0.002, "totalCarbs": 0.59, "totalSugar": 0.31, "protein": 0.38}'::jsonb),
(3031, 'BERRIES QUEEN', 3, 150000.00, 100, 'active', 1, 'A premium coffee blend featuring SL28 and SL34 beans, known for their vibrant acidity and distinct berry-like flavor profile.', '/CoffeeImages/BERRIES-QUEEN.jpg', 'SL28 coffee beans, SL34 coffee beans', '{"calories": 2, "totalFat": 0.23, "saturatedFat": 0.2, "transFat": 0.009, "totalCarbs": 0.5, "totalSugar": 0.3, "protein": 0.7}'::jsonb),

-- Milk
(4000, 'Sweetened Condensed Milk', 4, 35000.00, 100, 'active', 1, 'A rich and thick concentrated milk, heavily sweetened and perfect for coffee, baking, or desserts.', '/MilkImages/Sweetened-Condensed-Milk.jpg', 'Milk, Sugar', '{"calories": 321, "totalFat": 8.72, "saturatedFat": 5.46, "transFat": 0.31, "totalCarbs": 54.28, "totalSugar": 54.05, "protein": 7.91}'::jsonb), 
(4001, 'Full Cream Evaporated Milk', 4, 32000.00, 100, 'active', 1, 'Creamy and shelf-stable milk with 60% of water removed, ideal for adding richness to savory dishes and creamy sauces.', '/MilkImages/Full-Cream-Evaporated-Milk.jpg', 'Fresh Milk, Dipotassium Phosphate, Carrageenan, Vitamin D3', '{"calories": 134, "totalFat": 7.58, "saturatedFat": 4.63, "transFat": 0.28, "totalCarbs": 10.12, "totalSugar": 10.04, "protein": 6.81}'::jsonb), 
(4002, 'Unsweetened Almond Milk', 4, 55000.00, 100, 'active', 1, 'A smooth, plant-based dairy alternative made from roasted almonds with no added sugar.', '/MilkImages/Unsweetened-Almond-Milk.jpg', 'Almond Base (Water, Almonds), Sea Salt, Locust Bean Gum, Gellan Gum', '{"calories": 30, "totalFat": 2.54, "saturatedFat": 0.21, "transFat": 0.01, "totalCarbs": 1.15, "totalSugar": 0.08, "protein": 1.05}'::jsonb), 
(4003, 'Organic Whole Milk Powder', 4, 185000.00, 100, 'active', 1, 'Convenient and nutritious organic whole milk in powder form, enriched with essential vitamins.', '/MilkImages/Organic-Whole-Milk-Powder.jpg', 'Organic Whole Milk, Soy Lecithin, Vitamin A Palmitate, Vitamin D3', '{"calories": 496, "totalFat": 26.35, "saturatedFat": 16.42, "transFat": 0.88, "totalCarbs": 38.14, "totalSugar": 38.06, "protein": 26.32}'::jsonb), 
(4004, 'UHT Chocolate Milk', 4, 25000.00, 100, 'active', 1, 'A delicious and ready-to-drink treat combining fresh whole milk with rich cocoa powder.', '/MilkImages/UHT-Chocolate-Milk.jpg', 'Whole Milk, Sugar, Cocoa Powder, Natural Flavors, Stabilizers', '{"calories": 190, "totalFat": 4.85, "saturatedFat": 3.12, "transFat": 0.15, "totalCarbs": 26.42, "totalSugar": 24.18, "protein": 7.85}'::jsonb);
<<<<<<< HEAD
=======
=======
-- 3.2. Tài khoản Demo (Mật khẩu: 123) (trong seeder.js làm rồi)


-- 3.3. Sản phẩm mẫu
INSERT INTO product (id, name, category_id, price, stock, status, provide_id, description)
VALUES 
(101, 'Croissant', 1, 35000, 100, 'active', 1, 'Classic buttery flaky French pastry.'),
(102, 'Tiramisu Cake', 2, 250000, 20, 'active', 1, 'Authentic Italian coffee-flavored dessert.'),
(103, 'Arabica Espresso', 3, 45000, 500, 'active', 1, 'Rich and bold espresso shot.');
>>>>>>> 88d5037a18ec8c471bc2d991014543b11d97a2e3
>>>>>>> c76042bd05f32ce866a7c7b8178b3907dca305e7

COMMIT;