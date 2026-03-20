# 🌱 SeedsCraft — Vegetable Seeds E-Commerce Platform (MERN Stack)

A full-stack e-commerce platform for selling vegetable seeds, built with MongoDB, Express, React, and Node.js.

---

## ✨ Features

### 🛍️ Customer-Facing (Landing)
- **Homepage** — Hero banner, category grid, featured products, why-us section, CTA
- **Products Page** — Search, filter by category/season/organic, sort, pagination
- **Product Detail** — Image gallery, seed specs, germination rate, planting guide, add to cart
- **Category Page** — Visual category browsing with color-coded cards
- **Shopping Cart** — Quantity management, price breakdown, free shipping threshold
- **Checkout** — Address form, payment method selection (COD/UPI/Card)
- **My Orders** — Order history with status tracking
- **Profile** — Edit personal info, change password

### ⚙️ Admin Dashboard
- **Dashboard** — Revenue chart, orders by status (pie chart), top products, low stock alerts
- **Products CRUD** — Create/Edit/Delete with full seed metadata, image URLs, toggle active/featured
- **Categories CRUD** — Modal-based create/edit with emoji picker + color picker + preview
- **Orders Management** — Filter by status, update order status with notes, full order history
- **Users Management** — Search, enable/disable, delete (non-admin) users

### 🔒 Authentication
- JWT-based auth (30-day expiry)
- Role-based routing (admin vs user)
- Protected routes on both frontend and backend

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd seedscraft
npm run install-all
```

### 2. Configure Environment
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your values:
# MONGO_URI=mongodb://localhost:27017/seedscraft
# JWT_SECRET=your_secret_key_here_make_it_long_and_random
```

```bash
# Frontend
cp frontend/.env.example frontend/.env
# REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Seed Sample Data
```bash
npm run seed
# Creates admin, test user, 8 categories, 4 sample products
```

### 4. Run Development Servers
```bash
npm run dev
# Backend:  http://localhost:5000
# Frontend: http://localhost:3000
```

### 5. Login
| Role  | Email                    | Password  |
|-------|--------------------------|-----------|
| Admin | admin@seedscraft.com     | admin123  |
| User  | user@seedscraft.com      | user1234  |

---

## 📁 Project Structure

```
seedscraft/
├── package.json              ← Root: concurrent dev runner
├── backend/
│   ├── server.js             ← Express app entry
│   ├── .env.example
│   ├── config/
│   │   ├── db.js             ← Mongoose connection
│   │   └── seeder.js         ← Sample data seeder
│   ├── middleware/
│   │   └── auth.js           ← JWT protect + adminOnly + generateToken
│   ├── models/
│   │   ├── User.js           ← bcrypt, role enum
│   │   ├── Category.js       ← slug auto-gen
│   │   ├── Product.js        ← reviews, rating, soldCount
│   │   └── Order.js          ← status history, order number
│   └── routes/
│       ├── authRoutes.js     ← register, login, me, profile, password
│       ├── productRoutes.js  ← CRUD + reviews + filters
│       ├── categoryRoutes.js ← CRUD + public/admin variants
│       ├── orderRoutes.js    ← create, my-orders, all, status update
│       ├── userRoutes.js     ← list, toggle, delete
│       └── dashboardRoutes.js← aggregated stats + charts data
└── frontend/
    └── src/
        ├── App.js            ← All routes + guards
        ├── index.css         ← Global design system
        ├── context/
        │   ├── AuthContext.js← user state, login/logout/register
        │   └── CartContext.js← cart CRUD, localStorage persist
        ├── utils/
        │   └── api.js        ← All Axios API calls
        ├── components/
        │   ├── shared/
        │   │   ├── Navbar.js ← Sticky, scroll-aware, mobile menu
        │   │   └── Footer.js
        │   └── landing/
        │       └── ProductCard.js
        └── pages/
            ├── landing/
            │   ├── HomePage.js
            │   ├── ProductsPage.js
            │   ├── ProductDetailPage.js
            │   ├── CategoryPage.js
            │   ├── CartPage.js
            │   ├── CheckoutPage.js
            │   ├── OrdersPage.js
            │   ├── LoginPage.js    ← Also exports RegisterPage
            │   ├── RegisterPage.js
            │   └── ProfilePage.js
            └── admin/
                ├── AdminLayout.js    ← Collapsible sidebar
                ├── AdminDashboard.js ← Recharts graphs
                ├── AdminProducts.js  ← Table with search/delete/toggle
                ├── AdminProductForm.js← Full create/edit form
                ├── AdminCategories.js← Card grid + modal CRUD
                ├── AdminOrders.js    ← Status management
                └── AdminUsers.js     ← User list + toggle/delete
```

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | User | Get current user |
| PUT | `/api/auth/profile` | User | Update profile |
| PUT | `/api/auth/change-password` | User | Change password |
| GET | `/api/products` | Public | List (filters + pagination) |
| GET | `/api/products/:id` | Public | Single product |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |
| POST | `/api/products/:id/reviews` | User | Add review |
| GET | `/api/categories` | Public | Active categories |
| GET | `/api/categories/all` | Admin | All categories |
| POST/PUT/DELETE | `/api/categories/*` | Admin | Category CRUD |
| POST | `/api/orders` | User | Create order |
| GET | `/api/orders/my` | User | My orders |
| GET | `/api/orders` | Admin | All orders |
| PUT | `/api/orders/:id/status` | Admin | Update status |
| GET | `/api/users` | Admin | All users |
| PUT | `/api/users/:id/toggle-status` | Admin | Activate/Deactivate |
| DELETE | `/api/users/:id` | Admin | Delete user |
| GET | `/api/dashboard/stats` | Admin | Analytics data |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Recharts |
| State | React Context (Auth + Cart) |
| HTTP | Axios |
| Styling | Custom CSS with design system |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Notifications | react-hot-toast |

---

## 🔧 Customization Tips

1. **Add Razorpay/UPI payment** — Install razorpay SDK, add order create route, update frontend checkout
2. **Add image upload** — Cloudinary is already in package.json, just add multer-cloudinary middleware
3. **Add email notifications** — Add nodemailer to backend, trigger on order create/status change
4. **SEO** — Add react-helmet-async, update meta tags per page
5. **PWA** — Run `npx cra-pwa` or add service worker for offline support

---

## 📝 License
MIT — Built for SeedsCraft India 🌱
