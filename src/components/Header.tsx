import { Dog, Moon, Sun, User, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
  currentUser?: any;
  onLogout: () => void;
}

export function Header({ 
  darkMode, 
  toggleDarkMode, 
  currentPage, 
  onNavigate,
  currentUser,
  onLogout 
}: HeaderProps) {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate("landing")}
          >
            <div className="bg-primary rounded-full p-2">
              <Dog className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl text-foreground">Pet Trader</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onNavigate("landing")}
              className={`transition-colors ${
                currentPage === "landing" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate("landing")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Buy
            </button>
            <button
              onClick={() => onNavigate("listing-form")}
              className={`transition-colors ${
                currentPage === "listing-form" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sell
            </button>
            <button
              onClick={() => onNavigate("landing")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Adopt
            </button>
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => onNavigate("analytics")}
                className={`transition-colors ${
                  currentPage === "analytics" || currentPage === "dashboard" 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Admin
              </button>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full"
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
            
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full gap-2">
                    <User className="w-4 h-4" />
                    <span className="hidden md:inline">{currentUser.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                    <div className="flex flex-col">
                      <span>{currentUser.name}</span>
                      <span className="text-xs text-muted-foreground">{currentUser.email}</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {currentUser.role === 'admin' && (
                    <DropdownMenuItem onClick={() => onNavigate("analytics")}>
                      Analytics Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => onNavigate("listing-form")}>
                    Create Listing
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="outline" 
                className="rounded-full"
                onClick={() => onNavigate("auth")}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
