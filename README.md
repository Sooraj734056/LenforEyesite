# Lens For Eyesight - Premium E-Commerce Platform

A professional-grade, high-performance, mobile-first e-commerce application built for "Lens For Eyesight", a premium eyewear store in Raja Park, Jaipur.

## 🚀 Features

### Customer Experience
- **Premium Design**: Modern "Electric Blue" theme with minimalist aesthetics and smooth animations.
- **Smart Product Discovery**: Advanced multi-layered filtering (shape, material, width, brand, etc.).
- **Complex Cart System**: "Frame + Lens" bundle logic allowing customers to configure lenses (Zero Power, Single Vision, Progressive, etc.).
- **Virtual Try-On**: Integration ready for 3D/AI-based face mapping (TensorFlow.js).
- **Home Eye Test Booking**: Dedicated workflow for users to book certified optometrist visits in Jaipur.
- **Instant Search**: Auto-suggest search for brands and frame styles.
- **Secure Payments**: Razorpay integration for UPI, Cards, and NetBanking.

### Admin Management
- **Analytics Dashboard**: Real-time tracking of revenue, orders, and customer trends.
- **Order Workflow**: Multi-step order tracking (Prescription Verification → Lab → Shipping).
- **Inventory Management**: Full CRUD for products with variant/stock control and CSV bulk import.
- **Lab Job Sheets**: Automated PDF/Printable job sheets for lens manufacturing.
- **Marketing Tools**: Manage discount coupons and homepage promotional banners.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), CSS Modules, Zustand (State Management), Chart.js.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Payments**: Razorpay API.
- **Infrastructure**: JWT Auth with HTTP-only cookies, Rate Limiting, Multer for uploads.

## 📦 Installation & Setup

1. **Clone the repository**
2. **Setup Server**
   - Navigate to `server/`
   - Create `.env` file with:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     JWT_EXPIRE=30d
     CLIENT_URL=http://localhost:3000
     RAZORPAY_KEY_ID=your_key_id
     RAZORPAY_KEY_SECRET=your_key_secret
     ```
   - Run `npm install`
3. **Setup Client**
   - Navigate to `client/`
   - Create `.env.local` file with:
     ```env
     NEXT_PUBLIC_API_URL=http://localhost:5000/api
     NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id
     ```
   - Run `npm install`
4. **Seed Database**
   - In `server/`, run `node seed.js` to populate with sample products, banners, and admin credentials.

## Live Deployment

Recommended setup:
- `client/` -> Vercel
- `server/` -> Render or Railway
- Database -> MongoDB Atlas

### 1. Deploy the backend

Use `server/` as the backend project root.

Build/install:
```bash
npm install
```

Start command:
```bash
npm start
```

Server environment variables:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_strong_secret
JWT_EXPIRE=30d
CLIENT_URL=https://your-frontend-domain.vercel.app
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
NODE_ENV=production
```

After deploy, verify:
```text
https://your-backend-domain/api/health
```

### 2. Deploy the frontend

Use `client/` as the frontend project root.

Build command:
```bash
npm run build
```

Start command:
```bash
npm start
```

Frontend environment variables:
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id
```

### 3. Important production notes

- `CLIENT_URL` must be the exact frontend URL, otherwise CORS will block requests.
- `NEXT_PUBLIC_API_URL` must end with `/api`.
- Product and banner images can be uploaded on the backend; the frontend now resolves backend `/uploads/...` paths correctly in production.
- If you use free hosting, backend cold starts can make the first API call slow.

## 🚦 Running the Application

In the root directory, run:
```bash
npm run dev
```
This will start both the backend (Port 5000) and frontend (Port 3000) concurrently.

### Demo Credentials
- **Admin**: `admin@lensforeyesight.com` / `Admin@123`
- **Customer**: `demo@example.com` / `Demo@123`

## 📍 Store Location
Lens For Eyesight
Shop 14, Raja Park Main Road,
Jaipur - 302004, Rajasthan.
