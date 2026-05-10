# Task Manager Frontend

Modern React frontend for the Task Manager Todo Application with Material-UI design.

## 📋 Overview

This is the client-side application that provides:
- User registration and login interface
- Todo/Task management dashboard
- Priority-based task organization
- Responsive Material-UI design
- Real-time state management
- Secure authentication with JWT

## 🎨 Tech Stack

- **Library**: React 18.2.0
- **Routing**: React Router DOM 6
- **UI Framework**: Material-UI (MUI)
- **HTTP Client**: Axios
- **Icons**: Font Awesome & MUI Icons
- **Build Tool**: Create React App
- **Deployment**: GitHub Pages

## 📦 Installation

```bash
npm install
```

## 🔐 Environment Variables

Create a `.env` file:

```
REACT_APP_API_URL=http://localhost:5001/api
```

For production:
```
REACT_APP_API_URL=https://your-backend-url.render.com/api
```

## ▶️ Running

**Development**:
```bash
npm start
```

Opens at `http://localhost:3000`

**Build for Production**:
```bash
npm run build
```

**Deploy to GitHub Pages**:
```bash
npm run deploy
```

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html          # HTML template
│   └── manifest.json       # PWA manifest
├── src/
│   ├── App.js             # Main component
│   ├── App.css            # Global styles
│   ├── index.js           # Entry point
│   ├── components/
│   │   ├── Login.js       # Login page
│   │   ├── Register.js    # Registration page
│   │   ├── Navbar.js      # Navigation bar
│   │   ├── Todos.js       # Todo list page
│   │   └── PrivateRoute.js # Protected routes
│   └── context/
│       ├── AuthContext.js # Auth state
│       └── TodoContext.js # Todo state
└── package.json           # Dependencies
```

## ✨ Features

- **Authentication**: Secure login/registration with JWT
- **Todo Management**: Create, edit, delete, and complete todos
- **Priority Levels**: Set low, medium, or high priority
- **Due Dates**: Add deadlines to tasks
- **Responsive Design**: Works on desktop, tablet, and mobile
- **State Management**: React Context for global state
- **Protected Routes**: Private pages require authentication

## 🚀 Deployment

Deploy to [GitHub Pages](https://pages.github.com):

1. Update `homepage` in `package.json`:
```json
"homepage": "https://yourusername.github.io/task-manager-frontend"
```

2. Deploy:
```bash
npm run deploy
```

3. Enable GitHub Pages in repository settings

## 🔗 API Integration

Frontend communicates with backend API at:
- Local: `http://localhost:5001/api`
- Production: Your deployed backend URL

## 📝 License

MIT

