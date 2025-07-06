// This file was used for seeding dummy data during development
// Since the application now uses user authentication, each user should have their own data
// This file is kept for reference but should not be used in production

import mongoose from "mongoose";
import dotenv from "dotenv";
import Transaction from "./models/transaction.model.js";

dotenv.config();

console.log("⚠️  Seed data functionality has been disabled.");
console.log(
  "💡 Each user now has their own personal data after authentication."
);
console.log(
  "🚀 Start the application and create an account to begin tracking your finances!"
);

// The following dummy data has been commented out to prevent accidental seeding
/*
const DUMMY_TRANSACTIONS = [
  {
    amount: 1200,
    date: new Date("2025-07-01"),
    description: "Salary for July",
    type: "income",
    category: "Salary",
  },
  {
    amount: 150,
    date: new Date("2025-07-02"),
    description: "Groceries",
    type: "expense",
    category: "Food & Dining",
  },
  {
    amount: 60,
    date: new Date("2025-07-03"),
    description: "Bus pass",
    type: "expense",
    category: "Transportation",
  },
  {
    amount: 200,
    date: new Date("2025-07-04"),
    description: "Freelance project",
    type: "income",
    category: "Freelance",
  },
  {
    amount: 80,
    date: new Date("2025-07-05"),
    description: "Movie night",
    type: "expense",
    category: "Entertainment",
  },
  {
    amount: 100,
    date: new Date("2025-07-06"),
    description: "Electricity bill",
    type: "expense",
    category: "Bills & Utilities",
  },
];

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO);
    await Transaction.insertMany(DUMMY_TRANSACTIONS);
    console.log("Dummy transactions inserted!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedData();
*/
