```markdown
<div align="center">
  <h1>✨ AI Chat Assistant</h1>
  <p>A full-stack, responsive AI chat platform featuring secure authentication, modern UI/UX, and real-time token tracking.</p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  </p>
</div>

---

## 🚀 Features

* **🔐 Secure Authentication:** JWT-based HTTP-only cookie authentication with protected routes.
* **🎨 Modern Interface:** Beautifully designed using Tailwind CSS, featuring animated gradient borders, custom tooltips, and a responsive grid layout.
* **✅ Robust Validation:** Client-side and server-side form validation using Zod and React Hook Form.
* **📊 Usage Tracking:** Built-in dashboard to monitor API token usage and cycle resets.
* **💬 Dynamic Chat UI:** A seamless chatting experience with a sidebar history, optimistic UI updates, and Lucide React iconography.

---

## 🛠️ Tech Stack

### **Frontend (`/GPT_Frontend`)**
* **Framework:** React.js (Vite)
* **Styling:** Tailwind CSS
* **Routing:** React Router v6
* **State & Forms:** React Hook Form + Zod Resolvers
* **API Client:** Axios (configured for credentials)
* **Icons:** Lucide React

### **Backend (`/ChatgptBackend`)**
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB & Mongoose
* **Authentication:** JSON Web Tokens (JWT) & bcrypt
* **Architecture:** MVC Pattern (Controllers, Routes, Models, Middlewares)

---

## 📂 Project Structure

```text
├── ChatgptBackend/          # Node.js Express Backend
│   ├── config/              # Database & Environment configurations
│   ├── controllers/         # Route logic (msgController.js, userController.js)
│   ├── middlewares/         # Auth & Error handling
│   ├── model/               # Mongoose schemas
│   ├── routes/              # API endpoints
│   ├── Validators/          # Zod validation schemas
│   └── index.js             # Server entry point
│
└── GPT_Frontend/            # React Vite Frontend
    ├── src/
    │   ├── components/      # Reusable UI components
    │   ├── pages/           # Route views (Signup, Login, Home, Chat)
    │   ├── schema/          # Frontend Zod schemas
    │   ├── store/           # State management
    │   ├── App.jsx          # Router configuration
    │   └── main.jsx         # App entry point

```

---

## ⚙️ Local Development Setup

### 1. Clone the Repository

```bash
git clone [https://github.com/yourusername/chat-assistant.git](https://github.com/yourusername/chat-assistant.git)
cd chat-assistant

```

### 2. Backend Setup

```bash
cd ChatgptBackend
npm install

```

Create a `.env` file in the `ChatgptBackend` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key

```

Start the backend server:

```bash
npm run dev

```

### 3. Frontend Setup

Open a new terminal window:

```bash
cd GPT_Frontend
npm install

```

Start the Vite development server:

```bash
npm run dev

```

---

---

## 👨‍💻 Author

**Soumojit Ghosh**

* GitHub: [@Soumojit Ghosh](https://github.com/soumojit45)
* LinkedIn: [Soumojit Ghosh](https://linkedin.com/in/yourprofile)

---
