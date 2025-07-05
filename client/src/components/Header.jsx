import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice.js";
import { Button } from "./ui/button.jsx";
import { Moon, Sun, Wallet } from "lucide-react";

export default function Header() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <Wallet className="h-6 w-6" />
          <span className="text-lg font-bold">Personal Finance</span>
        </Link>

        <nav className="flex items-center space-x-4">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/transactions"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/transactions"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            Transactions
          </Link>
          <Link
            to="/budget"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/budget"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            Budget
          </Link>
          <Link
            to="/insights"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/insights"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            Insights
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>
        </nav>
      </div>
    </header>
  );
}
