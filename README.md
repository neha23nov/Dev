# Tech Freelance Platform

> A full-stack MERN freelance marketplace where clients hire verified tech freelancers for web, mobile, and software projects. Built for the Indian market with ₹ pricing, real-time chat, and scalable architecture.
---


## What is Dev?

Dev is a mini Fiverr for Indian tech talent. Freelancers post gigs (services), clients browse and hire them, pay securely, chat in real time, and leave reviews. Everything is built with scalability in mind — designed to handle 100+ concurrent users from day one.

---

## Features

### Core
- JWT authentication with role-based access (client / freelancer)
- Gig marketplace — create, browse, search, filter by category and price
- Order system — place, track, and manage orders with status flow
- Real-time chat per order using Socket.io
- Reviews and star ratings with automatic average calculation
- Cloudinary CDN for gig image uploads
- Mock payments (Cashfree integration ready)
- Freelancer dashboard — earnings, active orders, stats
- Client dashboard — spending, order history

### Tech & Scale
- MongoDB compound indexes for fast search and filter
- Cursor-based pagination — no slow skip() at scale
- Connection pooling — handles 100+ concurrent DB connections
- Rate limiting — 100 requests per 15 minutes per IP
- Response compression — 70% smaller payloads for Indian mobile users
- Layered architecture — Routes → Controllers → Services → Models

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express 5, Socket.io |
| Database | MongoDB Atlas (Mumbai region) |
| Auth | JWT + bcryptjs |
| Media | Cloudinary CDN |
| Payments | Mock (Cashfree ready) |
| Deploy | Vercel (frontend) + Render (backend) |

---

## Project Structure

```
dev/
├── client/                   # React frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js      # Axios instance + interceptors
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── GigDetail.jsx
│   │   │   ├── CreateGig.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Chat.jsx
│   │   └── App.jsx
│   └── .env
│
└── server/                   # Express backend
    ├── src/
    │   ├── config/
    │   │   ├── db.js          # MongoDB + connection pooling
    │   │   └── cloudinary.js  # Cloudinary + multer
    │   ├── models/
    │   │   ├── User.js
    │   │   ├── Gig.js
    │   │   ├── Order.js
    │   │   ├── Review.js
    │   │   └── Message.js
    │   ├── routes/
    │   ├── controllers/
    │   ├── services/
    │   ├── middleware/
    │   │   ├── verifyToken.js
    │   │   ├── verifyRole.js
    │   │   ├── upload.js
    │   │   └── errorHandler.js
    │   ├── utils/
    │   │   ├── ApiError.js
    │   │   ├── ApiResponse.js
    │   │   └── generateToken.js
    │   ├── app.js
    │   └── socket.js
    └── server.js
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/dev.git
cd dev
```

### 2. Setup backend
```bash
cd server
npm install
cp .env.example .env
# Fill in your .env values
node server.js
```

### 3. Setup frontend
```bash
cd client
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

### Environment Variables

**server/.env**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/dev
JWT_SECRET=your_jwt_secret_min_32_chars
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLIENT_URL=http://localhost:5173
```

**client/.env**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /api/auth/register | Public | Register new user |
| POST | /api/auth/login | Public | Login |
| GET | /api/auth/me | Private | Get current user |

### Gigs
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/gigs | Public | Get all gigs (search, filter, paginate) |
| GET | /api/gigs/:id | Public | Get single gig |
| POST | /api/gigs | Freelancer | Create gig |
| PUT | /api/gigs/:id | Freelancer | Update gig |
| DELETE | /api/gigs/:id | Freelancer | Delete gig |

### Orders
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/orders | Private | Get my orders (role-based) |
| GET | /api/orders/:id | Private | Get single order |
| POST | /api/orders | Client | Place order |
| PATCH | /api/orders/:id/status | Freelancer | Update status |
| PATCH | /api/orders/:id/cancel | Client | Cancel order |
| GET | /api/orders/stats | Freelancer | Earnings stats |

### Reviews
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/reviews/gig/:gigId | Public | Get gig reviews |
| POST | /api/reviews | Client | Post review |
| DELETE | /api/reviews/:id | Client | Delete review |

### Messages
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/messages/:orderId | Private | Get conversation |
| POST | /api/messages | Private | Send message |
| GET | /api/messages/unread | Private | Get unread count |

---

## Roadmap & Future Enhancements

### Payments
- [ ] Cashfree live integration (webhooks already structured)
- [ ] UPI QR code payments
- [ ] Escrow system — hold payment until delivery confirmed
- [ ] Freelancer withdrawal to bank account

### AI Features 🤖
- [ ] **AI gig description generator** — freelancer types keywords, Claude/GPT writes a professional gig description
- [ ] **Smart gig matching** — AI analyses client's project requirements and recommends the best matching gigs
- [ ] **AI proposal writer** — clients describe their project, AI generates a detailed requirements document to send freelancers
- [ ] **Fake review detector** — NLP model flags suspicious review patterns (all 5 stars from new accounts, copy-pasted text)
- [ ] **AI chat assistant** — bot answers common questions (pricing, delivery time) before client contacts freelancer
- [ ] **Skill verification quiz** — AI generates coding challenges to verify freelancer's claimed skills
- [ ] **Automatic gig tagging** — AI reads gig description and suggests relevant tags and categories
- [ ] **Price recommendation** — AI analyses similar gigs and suggests optimal pricing for new gigs
- [ ] **Dispute resolution AI** — when client and freelancer disagree, AI summarises the conversation and suggests a fair resolution
- [ ] **Portfolio analyser** — freelancer uploads GitHub URL, AI summarises their skills and suggests gig categories

### Platform
- [ ] Email notifications (Nodemailer + Gmail SMTP)
- [ ] Push notifications (Firebase FCM)
- [ ] Mobile app (React Native)
- [ ] Freelancer profile pages with public URL
- [ ] Admin panel — manage users, gigs, disputes
- [ ] Subscription plans — featured gig placement
- [ ] Hindi / regional language support
- [ ] GST invoice generation for Indian freelancers
- [ ] Referral programme

### Performance
- [ ] Redis caching for gig listings
- [ ] Elasticsearch for advanced search
- [ ] Image lazy loading + WebP conversion
- [ ] CDN for static assets

---

