# Aman Indra Classes (AIC) - Website & Admin CRM Panel

This is the full-stack web portal for **Aman Indra Classes (Kanpur)**. It contains a high-contrast public-facing educational website with dynamic SEO, blog listings, topper achievements grids, notice bulletins, and parent testimonials. It also includes a robust administrative control panel for inquiry management, dynamic website configuration, notifications center, and content management.

---

## 🛠️ Tech Stack

* **Frontend**: React (Vite, TypeScript, Tailwind CSS, Lucide Icons)
* **Backend**: Node.js (Express, Mongoose, MongoDB, Nodemailer, Cloudinary)
* **Design**: Vibrant brand theme, dynamic light/dark mode transitions on public site, forced high-contrast layouts in admin views, and floating animated sliding toast popups.

---

## 📂 Project Structure

```
Aman-Indra-Classes/
├── client/                 # Frontend React SPA
│   ├── src/
│   │   ├── components/     # UI Components (TopperCard, NoticeBoard, etc.)
│   │   ├── context/        # React Contexts (Auth, Settings, Theme, Toast)
│   │   ├── pages/          # Public and Admin pages
│   │   └── utils/          # Client API fetch wrappers
│   └── .env.example        # Frontend environment template
│
├── server/                 # Backend Node/Express API
│   ├── config/             # DB, Email, Cloudinary configs
│   ├── middleware/         # Auth, Upload middlewares
│   ├── models/             # Mongoose DB schemas (Lead, Notice, Blog, etc.)
│   ├── routes/             # API Router endpoints
│   ├── server.js           # Server boot entry point
│   └── .env.example        # Backend environment template
│
└── .gitignore              # Project-level git ignore rules
```

---

## 🚀 Getting Started

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (version 16+) and [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally.

### 2. Backend Installation & Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your variables:
   ```bash
   cp .env.example .env
   ```
   * *MongoDB*: Set `MONGODB_URI` to your local connection string or MongoDB Atlas connection link.
   * *Cloudinary (Optional)*: Provide your credentials if you want to store gallery/profile photos in Cloudinary to keep your database usage low. Otherwise, it automatically falls back to local storage in `server/uploads/`.
   * *SMTP Credentials (Optional)*: Set your mail host details to enable automated email confirmations to students and admin alerts. If left blank, it prints mock emails directly to the server console.

4. Start the server:
   ```bash
   # In development:
   npm run dev
   # Or in production:
   npm start
   ```

### 3. Frontend Installation & Setup
1. Navigate to the `client` directory:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   * Set `VITE_API_URL` to point to your backend API address (defaults to `http://localhost:5000/api`).

4. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## 🔒 Administrative Console

To access the Admin Portal, navigate to `/admin` in your browser.
* **Default Credentials** (defined in your backend `.env` variables):
  * **Email**: `your_configured_admin_email`
  * **Password**: `your_configured_admin_password`

Once logged in, you can manage admissions inquiries (Leads CRM), update global settings, upload gallery images, write prep blogs, post notice bulletins, and monitor system activities in the Notification Center.

---

## 📦 Production Bundling
To build the frontend assets for production:
```bash
cd client
npm run build
```
This will compile TypeScript and generate a static bundle in `client/dist/`, ready to be served by the backend or a CDN.
