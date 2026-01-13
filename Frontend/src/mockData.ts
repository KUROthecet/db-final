
import { Product, User, Role, Order, OrderStatus } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 1,
    email: 'admin@bakery.com',
    fullName: 'Le Ngoc Anh Vu',
    role: Role.MANAGER,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200',
    department: 'Executive',
    phone: '0901234567'
  },
  {
    id: 2,
    email: 'staff@bakery.com',
    fullName: 'Sarah Baker',
    role: Role.EMPLOYEE,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200',
    department: 'Kitchen',
    phone: '0909876543'
  },
  {
    id: 3,
    email: 'client@bakery.com',
    fullName: 'Sweet Customer',
    role: Role.CUSTOMER,
    address: '123 Bakery Street, Cake City',
    phone: '0987654321',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200',
  },
  {
    id: 4,
    email: 'john@bakery.com',
    fullName: 'John Dough',
    role: Role.EMPLOYEE,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200',
    department: 'Logistics',
    phone: '0912345678'
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 101,
    name: "Strawberry Christmas Tree Cake",
    category: "Christmas Cake",
    price: 220000,
    description: "A festive strawberry cake shaped like a tree.",
    stock: 20,
    status: 'active',
    image: "https://picsum.photos/300/300?random=1"
  },
  {
    id: 102,
    name: "Classic Tiramisu",
    category: "Cupcake",
    price: 55000,
    description: "Traditional Italian dessert with coffee and mascarpone.",
    stock: 50,
    status: 'active',
    image: "https://picsum.photos/300/300?random=2"
  },
  {
    id: 103,
    name: "Mango Ruby Pearl Cake",
    category: "Custom Cake",
    price: 350000,
    description: "Exotic mango flavors with ruby chocolate pearls.",
    stock: 12,
    status: 'active',
    image: "https://picsum.photos/300/300?random=3"
  },
  {
    id: 104,
    name: "Salted Egg Sponge Cake",
    category: "Salted egg sponge cake",
    price: 120000,
    description: "Savory and sweet sponge cake with salted egg yolk.",
    stock: 30,
    status: 'active',
    image: "https://picsum.photos/300/300?random=4"
  },
  {
    id: 105,
    name: "Christmas Log Cake",
    category: "Christmas Cake",
    price: 280000,
    description: "Traditional Yule log chocolate cake.",
    stock: 15,
    status: 'active',
    image: "https://picsum.photos/300/300?random=5"
  },
  {
    id: 106,
    name: "Singapore Cream Puffs",
    category: "Pastry",
    price: 45000,
    description: "Box of 6 cream puffs.",
    stock: 100,
    status: 'active',
    image: "https://picsum.photos/300/300?random=6"
  },
  {
    id: 107,
    name: "Artisan Sourdough Loaf",
    category: "Bread",
    price: 85000,
    description: "Naturally leavened bread with a crispy crust and chewy crumb.",
    stock: 25,
    status: 'active',
    image: "https://images.unsplash.com/photo-1585478479636-19de06774a39?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 108,
    name: "French Baguette",
    category: "Bread",
    price: 35000,
    description: "Classic French stick, baked fresh daily.",
    stock: 40,
    status: 'active',
    image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 109,
    name: "Iced Caramel Macchiato",
    category: "Coffee Beverage",
    price: 65000,
    description: "Rich espresso with vanilla syrup, milk, and caramel drizzle.",
    stock: 100,
    status: 'active',
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 110,
    name: "Royal Milk Tea",
    category: "Tea Beverage",
    price: 55000,
    description: "Premium brewed tea with fresh milk.",
    stock: 100,
    status: 'active',
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800&auto=format&fit=crop"
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-001",
    customerId: 3,
    customerName: "Sweet Customer",
    date: new Date(Date.now() - 86400000).toISOString(),
    totalAmount: 275000,
    status: OrderStatus.COMPLETED,
    shippingAddress: "123 Bakery St",
    phone: "099999999",
    items: [
      { productId: 101, productName: "Strawberry Christmas Tree Cake", quantity: 1, price: 220000 },
      { productId: 102, productName: "Classic Tiramisu", quantity: 1, price: 55000 }
    ]
  },
  {
    id: "ORD-002",
    customerId: 3,
    customerName: "Sweet Customer",
    date: new Date().toISOString(),
    totalAmount: 350000,
    status: OrderStatus.PENDING,
    shippingAddress: "123 Bakery St",
    phone: "099999999",
    items: [
      { productId: 103, productName: "Mango Ruby Pearl Cake", quantity: 1, price: 350000 }
    ]
  }
];
