# Personal Finance Tracker

A beautiful and intuitive personal finance management application built with React, Node.js, Express, and MongoDB. Track your income, expenses, and budgets with user authentication and data isolation.

## 🚀 Features

### Authentication & Security

- **User Registration & Login**: Secure JWT-based authentication
- **Data Isolation**: Each user's financial data is completely private and isolated
- **Password Security**: Passwords are hashed using bcryptjs
- **Session Management**: HTTP-only cookies for secure token storage

### Transaction Management

- **Income & Expense Tracking**: Add, edit, and delete transactions
- **Categorization**: Predefined categories for consistency
- **Date Tracking**: Historical transaction records
- **Search & Filter**: Easy transaction management

### Budget Planning

- **Monthly Budgets**: Set budgets for different expense categories
- **Budget vs Actual**: Visual comparison of planned vs actual spending
- **Budget Alerts**: Track overspending in different categories
- **Progress Tracking**: Monitor your budget adherence

### Analytics & Insights

- **Monthly Spending Charts**: Visual representation of spending patterns
- **Category Breakdown**: Pie charts for expense distribution
- **Spending Insights**: Month-over-month comparisons
- **Financial Dashboard**: Overview of your financial health

### User Experience

- **Beautiful Landing Page**: Modern, animated interface
- **Responsive Design**: Works on desktop and mobile
- **Dark/Light Theme**: Toggle between themes
- **Loading States**: Smooth user experience with proper loading indicators
- **Empty States**: Helpful messages when no data is available

## 🛠️ Technology Stack

### Frontend

- **React 18**: Modern React with hooks
- **Redux Toolkit**: State management
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Recharts**: Data visualization
- **Lucide React**: Beautiful icons

### Backend

- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **Cookie Parser**: HTTP cookie parsing

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn package manager

## 🔧 Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd finance-tracker
   ```

2. **Install backend dependencies**

   ```bash
   cd api
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**
   Create a `.env` file in the `api` directory:

   ```env
   MONGO=mongodb://localhost:27017/finance-tracker
   # OR for MongoDB Atlas:
   # MONGO=mongodb+srv://username:password@cluster.mongodb.net/finance-tracker

   JWT_SECRET=your-super-secret-jwt-key-here
   NODE_ENV=development
   ```

5. **Build the frontend**

   ```bash
   cd client
   npm run build
   ```

6. **Start the application**

   ```bash
   cd ../api
   npm start
   ```

7. **Access the application**
   Open your browser and navigate to `http://localhost:3001`

## 🎯 Usage

### Getting Started

1. **Create an Account**: Visit the landing page and register with your details
2. **Add Transactions**: Start by adding your income and expense transactions
3. **Set Budgets**: Create monthly budgets for different categories
4. **View Insights**: Check your dashboard for spending patterns and analytics

### Key Features

- **Dashboard**: Overview of your financial health with charts and summaries
- **Transactions**: Add, edit, and manage all your financial transactions
- **Budget**: Set and track monthly budgets by category
- **Insights**: Detailed analytics and spending insights
- **Profile**: Manage your account settings

## 🔒 Security Features

- **Authentication Required**: All financial data endpoints require authentication
- **User Isolation**: Users can only access their own data
- **Secure Cookies**: JWT tokens stored in HTTP-only cookies
- **Password Hashing**: All passwords are securely hashed
- **Input Validation**: Comprehensive validation on all inputs

## 📁 Project Structure

```
finance-tracker/
├── api/                          # Backend server
│   ├── controllers/              # Route handlers
│   ├── middleware/              # Authentication middleware
│   ├── models/                  # Database models
│   ├── routes/                  # API routes
│   ├── utils/                   # Utility functions
│   └── index.js                 # Main server file
├── client/                      # Frontend React app
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── redux/              # State management
│   │   ├── utils/              # Utility functions
│   │   └── App.jsx             # Main app component
│   └── public/                 # Static assets
└── README.md
```

## 🔮 Future Enhancements

- **Export Data**: CSV/PDF export functionality
- **Goal Setting**: Financial goal tracking
- **Recurring Transactions**: Automatic transaction creation
- **Investment Tracking**: Portfolio management
- **Multi-currency Support**: International currency support
- **Bank Integration**: Automatic transaction import
- **Mobile App**: Native mobile applications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Charts by [Recharts](https://recharts.org/)
- Animations by [Framer Motion](https://www.framer.com/motion/)
- Styling by [Tailwind CSS](https://tailwindcss.com/)

---

**Note**: This application is designed for personal use. Always ensure your MongoDB connection is secure and never commit sensitive environment variables to version control.
