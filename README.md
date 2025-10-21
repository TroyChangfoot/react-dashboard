
# 🧭 React Admin Dashboard

A modern **React + Chakra UI** admin dashboard that consumes a **Django REST API** backend.  
It provides full CRUD interfaces for **Products**, **Customers**, and **Orders**, plus a smart dashboard overview with metrics and statistics.

---

## 🚀 Features

- ⚡ **Full CRUD** for Products, Customers, and Orders  
- 💳 Dynamic Order Management (with multiple order items)  
- 📊 Dashboard Overview with Order, Product, and Customer stats  
- 💰 Real-time revenue totals and low-stock alerts  
- 🔐 JWT Authentication-ready API integration  
- 🎨 Built with **Chakra UI 2.10.9** + **TypeScript**  
- 📱 Responsive layout and clean design  

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React 18, TypeScript, Chakra UI 2.10.9 |
| Charts | Recharts (for upcoming dashboard analytics) |
| API | Django REST Framework + JWT |
| Styling | Tailwind (optional) + Chakra Theme |
| HTTP | Axios client with JWT interceptor |

---

## ⚙️ Setup

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Configure API endpoint

In `/src/api/axiosClient.ts`, update your backend base URL:
```ts
const axiosClient = axios.create({
  baseURL: "http://localhost:8000/api", // update if needed
});
```

### 3️⃣ Run the app

```bash
npm start
```

This launches the development server on `http://localhost:3000`.

---

## 📂 Folder Structure

```
react-dashboard/
├── src/
│   ├── api/              # Axios client configuration
│   ├── components/       # Shared components (Sidebar, Topbar, etc.)
│   ├── layouts/          # Layout wrappers
│   ├── pages/            # Core pages (Dashboard, Products, Orders, Customers)
│   ├── theme.ts          # Chakra theme customization
│   ├── App.tsx           # Router setup
│   └── index.tsx         # App entrypoint
└── package.json
```

---

## 📈 Dashboard Metrics

The **DashboardHome** page aggregates live stats from the Django API:
- Total Orders
- Orders by status (Pending / Paid / Shipped)
- Total Revenue (in Rand)
- Total Products (with low-stock detection)
- Total Customers

---

## 🔒 Authentication

The project is structured for easy JWT integration:
- Add login flow (`Login.tsx`) to store token in localStorage.
- Axios client automatically sends `Authorization: Bearer <token>`.
- Protected routes can be wrapped with a `ProtectedRoute` component.

---

## 🧩 Future Enhancements

- 📊 Add charts with Recharts (sales trends, order distribution)
- 🌈 Dark mode toggle via Chakra theme
- 🧠 Pagination & filtering in CRUD tables
- 🪄 Editable in-table CRUD interactions

---

## 🧑‍💻 Developer Notes

- Compatible with React 18+
- Chakra 2.10.9 is used (for Modal, Table, Stat, etc.)
- Designed for smooth integration with the Django CRUD API backend

---

## 🪪 License

MIT © 2025 Troy Changfoot
