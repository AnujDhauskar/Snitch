# 🛍️ SNITCH - Multi-Vendor E-Commerce Platform

A scalable **Multi-Vendor E-Commerce Platform** inspired by modern clothing brands, built using **React, Redux Toolkit, Node.js, MongoDB, Docker, and Kubernetes**.

The platform provides separate dashboards for **Buyers** and **Sellers**, secure authentication using **JWT & Google OAuth 2.0**, online payments through **Razorpay**, and follows a **Microservices Architecture** for scalability and maintainability.

---

## Images
*Login Page*
<img width="1312" height="887" alt="image" src="https://github.com/user-attachments/assets/597ee8c8-fab7-40db-8a3e-441c3626ed31" />
*Registration page*
<img width="1311" height="906" alt="image" src="https://github.com/user-attachments/assets/e8480bfd-333e-4f8f-9075-a5e62e2baafa" />
*Home Page*
<img width="1876" height="897" alt="image" src="https://github.com/user-attachments/assets/eb8d58ac-29ef-46a6-a29d-d4d807d4c732" />
*Cart feature*
<img width="1755" height="692" alt="image" src="https://github.com/user-attachments/assets/25641739-5ad8-4daa-81c5-96e23be1ce61" />

*Razorpay Integration*
<img width="1467" height="822" alt="image" src="https://github.com/user-attachments/assets/15e4967d-0c8e-405a-8bf5-a58b351ea2f6" />

*Order Confirmation Page| Track your order*
<img width="1838" height="892" alt="image" src="https://github.com/user-attachments/assets/d60e5db1-3f18-4c9c-b2a1-0e99aaa3da8c" />



*Seller Dashboard*
<img width="1878" height="897" alt="image" src="https://github.com/user-attachments/assets/5cf0c092-8a97-48a4-ac31-87293c869a8a" />





## 🚀 Features

### 👤 Authentication
- User Registration & Login
- JWT Authentication
- Google OAuth 2.0 Login
- Protected Routes
- Role-Based Authorization
- Secure Password Hashing
- Persistent User Sessions

---

### 🛒 Buyer Features

- Browse Products
- Product Search
- Category Filtering
- Size & Color Selection
- Product Variants
- Shopping Cart
- Quantity Management
- Secure Checkout
- Razorpay Payment Gateway
- Order Placement
- Order History
- Responsive UI

---

### 🏪 Seller Features

Dedicated Seller Dashboard

- Add Products
- Update Products
- Delete Products
- Product Variant Management
- Inventory Management
- Stock Tracking
- Price Management
- Offer & Discount Management
- View Orders
- Dashboard Analytics

---

### 📦 Order Management

- Create Orders
- Track Orders
- Order Status Updates
- Payment Verification
- Inventory Synchronization
- Order History

---

### 💳 Payment Integration

Integrated with **Razorpay**

Features include:

- Secure Online Payments
- Payment Verification
- Order Confirmation
- Transaction Records

---

### 📱 Responsive Design

- Mobile Friendly
- Tablet Support
- Desktop Optimized
- Modern UI
- Smooth User Experience

---

# 🏗️ Microservices Architecture

The application is built using **5 independent microservices**.

```
                    +----------------+
                    | React Frontend |
                    +--------+-------+
                             |
                      API Gateway
                             |
        ------------------------------------------
        |         |         |         |          |
      Auth     Product     Cart     Order     Payment
     Service   Service    Service   Service   (Gateway)
        |         |          |         |
        -------- MongoDB Databases -------
```

### Services

### 🔐 Auth Service

Responsible for

- User Authentication
- JWT Generation
- Google OAuth
- User Authorization

---

### 📦 Product Service

Responsible for

- Product Management
- Categories
- Variants
- Inventory
- Offers
- Stock

---

### 🛒 Cart Service

Responsible for

- Add to Cart
- Remove from Cart
- Update Quantity
- Cart Persistence

---

### 📑 Order Service

Responsible for

- Order Creation
- Order History
- Order Tracking
- Payment Validation

---

### 🚪 API Gateway

Responsible for

- Routing Requests
- Service Communication
- Authentication Middleware
- Centralized API Access

---

# ⚙️ Tech Stack

## Frontend

- React.js
- Redux Toolkit
- React Router
- Axios
- Tailwind CSS
- HTML5
- CSS3
- JavaScript (ES6+)

---

## Backend

- Node.js
- Express.js
- REST APIs
- JWT Authentication
- Google OAuth 2.0

---

## Database

- MongoDB
- Mongoose

---

## Payments

- Razorpay

---

## DevOps

- Docker
- Docker Compose
- Kubernetes

---

## Version Control

- Git
- GitHub

---

# 📂 Project Structure

```
SNITCH
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── auth-service/
│
├── product-service/
│
├── cart-service/
│
├── order-service/
│
├── gateway/
│
├── docker-compose.yml
│
├── kubernetes/
│   ├── auth.yaml
│   ├── product.yaml
│   ├── cart.yaml
│   ├── order.yaml
│   ├── gateway.yaml
│   └── ingress.yaml
│
└── README.md
```

---

# 🔐 Authentication Flow

```
User
   │
   ▼
Login/Register
   │
JWT Generated
   │
Stored Securely
   │
Protected Routes
   │
Access Services
```

Google OAuth is also supported for quick login.

---

# 🛍️ Product Workflow

```
Seller
   │
Add Product
   │
Inventory Created
   │
Variants Added
   │
Offers Applied
   │
Published
   │
Buyer Can Purchase
```

---

# 🛒 Buyer Workflow

```
Browse Products
       │
Select Variant
       │
Add to Cart
       │
Checkout
       │
Razorpay Payment
       │
Order Created
       │
Inventory Updated
```

---

# 📦 Database Models

### User

- Name
- Email
- Password
- Role
- Google ID

---

### Product

- Product Name
- Description
- Images
- Category
- Brand
- Price
- Discount
- Variants
- Seller
- Stock

---

### Cart

- User
- Products
- Quantity
- Total Price

---

### Order

- User
- Products
- Payment Status
- Shipping Address
- Total Amount
- Order Status

---

### Inventory

- Product
- Variant
- Available Stock

---

# 🔑 Environment Variables

Example `.env`

```env
PORT=

MONGODB_URI=

JWT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

FRONTEND_URL=

API_GATEWAY_URL=
```

---

# 🐳 Docker Setup

Build the containers

```bash
docker-compose build
```

Start all services

```bash
docker-compose up
```

Run in detached mode

```bash
docker-compose up -d
```

Stop all services

```bash
docker-compose down
```

---

# ☸️ Kubernetes Deployment

Apply all deployments

```bash
kubectl apply -f kubernetes/
```

Check Pods

```bash
kubectl get pods
```

Check Services

```bash
kubectl get svc
```

Check Deployments

```bash
kubectl get deployments
```

---

# 📡 REST API

## Authentication

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

---

## Products

```
GET     /api/products
GET     /api/products/:id
POST    /api/products
PUT     /api/products/:id
DELETE  /api/products/:id
```

---

## Cart

```
GET     /api/cart
POST    /api/cart/add
PUT     /api/cart/update
DELETE  /api/cart/remove
```

---

## Orders

```
POST   /api/orders
GET    /api/orders
GET    /api/orders/:id
```

---

# 🔒 Security Features

- JWT Authentication
- Google OAuth 2.0
- Password Hashing
- Protected APIs
- Role-Based Access Control
- Secure REST APIs
- Input Validation

---

# 📈 Performance & Scalability

- Microservices Architecture
- Independent Service Deployment
- Docker Containerization
- Kubernetes Orchestration
- API Gateway Routing
- Modular Backend Design
- Scalable Service Communication

---

# 🎯 Key Highlights

- ✅ Multi-Vendor E-Commerce Platform
- ✅ Buyer & Seller Dashboards
- ✅ Product Variants & Inventory Management
- ✅ Razorpay Payment Integration
- ✅ JWT + Google OAuth Authentication
- ✅ Dockerized Microservices
- ✅ Kubernetes Deployment
- ✅ RESTful APIs
- ✅ Responsive React UI
- ✅ Redux Toolkit State Management

---

# 🚀 Future Enhancements

- Wishlist
- Product Reviews & Ratings
- Email Notifications
- Admin Dashboard
- Coupon System
- Real-time Order Tracking
- AI-based Product Recommendations
- Analytics Dashboard
- Elasticsearch Product Search
- Redis Caching

---

# 👨‍💻 Author

**Anuj Dhauskar**

**GitHub:** https://github.com/AnujDhauskar

If you found this project useful, consider giving it a ⭐ on GitHub.
