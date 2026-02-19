# SHAREFAR.AI Frontend

A production-ready React frontend for SHAREFAR.AI backend API.

## 📚 Tech Stack

- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Responsive styling (no frameworks)
- **JavaScript** - No TypeScript

---

## 📁 Project Structure

```
src/
├── components/           # Reusable components
│   ├── Navbar.js
│   ├── Button.js
│   └── Card.js
├── pages/                # Page components
│   ├── Home.js
│   ├── Dashboard.js
│   └── NotFound.js
├── layouts/              # Layout wrappers
│   └── MainLayout.js
├── services/             # API integration
│   └── api.js
├── styles/               # CSS files
│   ├── index.css
│   ├── Navbar.css
│   ├── Button.css
│   ├── Card.css
│   ├── Home.css
│   ├── Dashboard.css
│   └── NotFound.css
├── App.js                # Main app component
└── index.js              # Entry point
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v14+ ([Download](https://nodejs.org/))
- Backend API running at `http://localhost:5000`

### Installation

1. **Navigate to Frontend folder:**
   ```bash
   cd Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

   The app will open at **http://localhost:3000**

---

## 📦 Available Scripts

| Command | Purpose |
|---------|---------|
| `npm start` | Run development server |
| `npm build` | Create production build |
| `npm test` | Run tests |

---

## 🔌 API Integration

### Services Configuration

File: `src/services/api.js`

- Base URL: `http://localhost:5000/api`
- Axios instance with interceptors
- Request/response logging
- Error handling

### Available Endpoints

- `getHealth()` - GET /api/health
- `testDatabase()` - GET /api/db-test

### Usage Example

```javascript
import { getHealth } from '../services/api';

// In your component
const handleCheck = async () => {
  try {
    const response = await getHealth();
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## 🎨 UI Components

### Navbar
Location: `src/components/Navbar.js`
- Sticky navigation
- Links to Home and Dashboard
- Responsive design

### Layout
Location: `src/layouts/MainLayout.js`
- Wraps all pages
- Contains Navbar and Footer
- Consistent structure

### Card
Location: `src/components/Card.js`
- Reusable card component
- Optional title header
- Elevation on hover

### Button
Location: `src/components/Button.js`
- Multiple variants: primary, secondary, danger, success
- Disabled state
- Loading state support

---

## 📄 Pages

### Home (/)
- Hero section with project intro
- Features overview
- Call-to-action to Dashboard

### Dashboard (/dashboard)
- Real-time API testing
- Health check endpoint
- Database connection test
- Raw JSON response display
- Loading and error states

### Not Found (*)
- 404 error page
- Navigation links
- User-friendly design

---

## 🛠️ Development Workflow

### Adding a New Page

1. Create page file in `src/pages/`:
   ```javascript
   import React from 'react';
   import Layout from '../layouts/MainLayout';

   const NewPage = () => {
     return (
       <Layout>
         {/* Your content here */}
       </Layout>
     );
   };

   export default NewPage;
   ```

2. Add route in `src/App.js`:
   ```javascript
   <Route path="/new-page" element={<NewPage />} />
   ```

### Adding a New Component

1. Create component file in `src/components/`
2. Create corresponding CSS file in `src/styles/`
3. Import and use in pages

### Using API Calls

1. Define function in `src/services/api.js`
2. Import in component
3. Use with `useEffect` and `useState`

---

## 🎯 Best Practices Used

✅ **Functional Components** - Only function-based components  
✅ **Hooks Only** - useState, useEffect, custom hooks  
✅ **Modular Structure** - Separated concerns (components, pages, services)  
✅ **Async/Await** - Modern async patterns  
✅ **Error Handling** - Try/catch blocks  
✅ **Loading States** - User feedback during API calls  
✅ **Responsive Design** - Mobile-first CSS  
✅ **Clean Code** - Readable, maintainable structure  
✅ **Environment Variables** - Secure configuration  
✅ **No State Management Library** - Simple useState for now  

---

## 🔒 Environment Variables

File: `.env`

```env
REACT_APP_API_URL=http://localhost:5000/api
```

⚠️ **Note:** Environment variables must start with `REACT_APP_` to be accessible in the browser.

---

## 🐛 Troubleshooting

### Issue: "Cannot GET /"
**Solution:** Make sure backend is running at http://localhost:5000

### Issue: API calls failing
**Solution:**
- Check backend is running
- Verify `.env` has correct API URL
- Check CORS is enabled in backend

### Issue: Components not rendering
**Solution:**
- Clear browser cache (Ctrl+Shift+Delete)
- Restart development server (npm start)
- Check console for errors

### Issue: Port 3000 already in use
**Solution:** Change port:
```bash
set PORT=3001 && npm start
```

---

## 📖 React Hooks Used

- **useState** - State management
- **useEffect** - Side effects (API calls, cleanup)
- **Custom Hooks** - Can be added in future

---

## 🎨 Styling Approach

- Pure CSS (no framework)
- CSS Grid for layouts
- Flexbox for alignment
- CSS Variables ready (can be implemented)
- Responsive media queries
- Gradient backgrounds
- Smooth transitions

---

## 📚 Folder-to-Feature Mapping

| Folder | Purpose |
|--------|---------|
| `components/` | Reusable UI elements |
| `pages/` | Full-page components |
| `layouts/` | Page wrappers |
| `services/` | API calls |
| `styles/` | CSS files |
| `public/` | Static assets |

---

## 🚀 Deployment Ready

- Production build: `npm build`
- Creates optimized `build/` folder
- Ready for hosting (Vercel, Netlify, AWS, etc.)
- Environment-based configuration
- NO hardcoded secrets

---

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test locally
4. Commit changes
5. Push to repository

---

**Built with ❤️ for SHAREFAR.AI**
