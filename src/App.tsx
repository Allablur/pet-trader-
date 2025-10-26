import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { LandingPage } from "./components/LandingPage";
import { PetDetailsPage } from "./components/PetDetailsPage";
import { AdminDashboard } from "./components/AdminDashboard";
import { AdminAnalyticsDashboard } from "./components/AdminAnalyticsDashboard";
import { ListingForm } from "./components/ListingForm";
import { AuthPage } from "./components/AuthPage";
import { Toaster } from "./components/ui/sonner";

type Page = "landing" | "pet-details" | "dashboard" | "analytics" | "listing-form" | "auth";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Check for existing session in localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('currentUser');
    
    if (storedToken && storedUser) {
      setAccessToken(storedToken);
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleNavigate = (page: string, petId?: string) => {
    setCurrentPage(page as Page);
    if (petId !== undefined) {
      setSelectedPetId(petId);
    }
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAuthSuccess = (token: string, user: any) => {
    setAccessToken(token);
    setCurrentUser(user);
    
    // Store in localStorage
    localStorage.setItem('accessToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Navigate to appropriate dashboard
    if (user.role === 'admin') {
      handleNavigate('analytics');
    } else {
      handleNavigate('landing');
    }
  };

  const handleLogout = () => {
    setAccessToken(null);
    setCurrentUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    handleNavigate('landing');
  };

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return (
          <LandingPage 
            onNavigate={handleNavigate} 
            accessToken={accessToken}
            currentUser={currentUser}
          />
        );
      case "pet-details":
        return (
          <PetDetailsPage 
            petId={selectedPetId} 
            onNavigate={handleNavigate}
            accessToken={accessToken}
            currentUser={currentUser}
          />
        );
      case "dashboard":
        return (
          <AdminDashboard 
            onNavigate={handleNavigate}
            accessToken={accessToken}
            onLogout={handleLogout}
          />
        );
      case "analytics":
        return (
          <AdminAnalyticsDashboard 
            onNavigate={handleNavigate}
            accessToken={accessToken}
            onLogout={handleLogout}
          />
        );
      case "listing-form":
        return (
          <ListingForm 
            onNavigate={handleNavigate}
            accessToken={accessToken}
            currentUser={currentUser}
          />
        );
      case "auth":
        return (
          <AuthPage 
            onAuthSuccess={handleAuthSuccess}
            onNavigate={handleNavigate}
          />
        );
      default:
        return (
          <LandingPage 
            onNavigate={handleNavigate}
            accessToken={accessToken}
            currentUser={currentUser}
          />
        );
    }
  };

  const showHeaderFooter = !["dashboard", "analytics", "auth"].includes(currentPage);

  return (
    <div className="min-h-screen bg-background">
      {showHeaderFooter && (
        <Header
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          currentPage={currentPage}
          onNavigate={handleNavigate}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}
      {renderPage()}
      {showHeaderFooter && <Footer />}
      <Toaster />
    </div>
  );
}
