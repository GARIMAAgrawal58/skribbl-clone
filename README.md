# 🎨 Skribbl Clone (Multiplayer Drawing Game)

A real-time multiplayer drawing and guessing game inspired by Skribbl.io. Built using **React, Node.js, Express, and Socket.io**.

---

## 🚀 Features

### ✅ Core Features

* 🎮 Multiplayer room system
* ✏️ Real-time drawing (canvas sync)
* 💬 Live chat + guessing system
* 🧠 Random word generation
* 👑 Turn-based gameplay (drawer rotates)
* 🏆 Score system & leaderboard
* 🎨 Drawing tools (color picker, brush size, clear canvas)

---

### ⚡ Advanced Features

* ⏱️ Timer for each round
* 👤 Active player indicator (who is drawing)
* 🔄 Auto next round system
* 🧩 Word guessing validation
* 📡 Real-time updates using WebSockets

---

## 🛠️ Tech Stack

### Frontend:

* React (Vite)
* Socket.io Client
* HTML5 Canvas

### Backend:

* Node.js
* Express.js
* Socket.io

---

## 📁 Project Structure

```
skribbl-clone/
│
├── backend/
│   ├── socket/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── socket.js
│   │   └── main.jsx
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/GARIMAAgarwal58/skribbl-clone.git
cd skribbl-clone
```

---

### 2️⃣ Install dependencies

#### Backend:

```bash
cd backend
npm install
```

#### Frontend:

```bash
cd frontend
npm install
```

---

### 3️⃣ Run the project

#### Start backend:

```bash
npm run dev
```

#### Start frontend:

```bash
npm run dev
```

---

## 🌐 Deployment

* Backend deployed on **Render**
* Frontend deployed on **Vercel**

---

## 🎯 How to Play

1. Enter your name and join a room
2. One player becomes the **drawer**
3. Drawer draws a word on canvas
4. Other players guess via chat
5. Correct guess earns points 🎉
6. Game continues in rounds

---

## 📌 Future Improvements

* Word selection system (multiple choices)
* Hint system (reveal letters)
* Game end screen with winner
* Private rooms & settings
* Eraser / undo tools

---

## 🙌 Author

Garima  
UI/UX Designer & MERN Developer 💻✨

