# Rentify

**Rentify** is a rental management system application where users can register and rent various types of **electronics** such as laptops, mobiles, cameras, and more.  
The platform is designed to simplify the rental process by providing a seamless interface for both renters and rentees.

---

## 🚀 Features
- User registration & authentication (via Firebase).
- Browse and search different electronics available for rent.
- Rent electronics with easy booking flow.
- Responsive web app (Next.js + Tailwind + SHADCN).
- Cross-platform mobile app (React Native + Native Elements).
- Backend API with **Express.js + Node.js**.
- Relational database using **PostgreSQL** powered by **Drizzle ORM**.

---

## 🛠 Tech Stack

### Frontend
- **Next.js**  
- **React Native** (with Native Elements)  
- **Tailwind CSS**  
- **SHADCN UI**  

### Backend
- **Node.js + Express.js**  
- **Drizzle ORM**  
- **PostgreSQL**  

### Others
- **Firebase** (authentication, possibly hosting or notifications)  

---

## 📂 Project Structure
  Rentify/
  │── web/ # Next.js frontend (web app)
  │── mobile/ # React Native mobile app
  │── server/ # Node.js + Express backend API

---

## ⚡ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/tajbaba999/Rentify.git
cd Rentify
 ```

2. Install dependencies (all projects)
```bash
# Install backend dependencies
cd server && npm install && cd ..

# Install web frontend dependencies
cd web && npm install && cd ..

# Install mobile app dependencies
cd mobile && npm install && cd ..
```
3. Run the apps
Start Backend (API)
```bash
cd server
npm run dev
```

Start Web App (Next.js)
```bash
cd web
npm run dev
```
Start Mobile App (React Native)
```bash
cd mobile
npm start
```

