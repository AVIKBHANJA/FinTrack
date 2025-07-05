import mongoose from "mongoose";
import dotenv from "dotenv";
import Transaction from "./models/transaction.model.js";

dotenv.config();

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