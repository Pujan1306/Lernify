import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import { Loader2 } from "lucide-react";
import ProtectRoute from "./middleware/protectRoute";
import LoginPage from "./pages/auth/loginPage";
import Signup from "./pages/auth/signupPage";
import { useAuth } from "./context/AuthContext";
import Dashboard from "./pages/dashboard/dashboardPage";
import Documents from "./pages/dashboard/documentPage";
import DocumentDetail from "./pages/dashboard/documentDetailPage";
import Flashcards from "./pages/dashboard/flashcardsPage";
import Profile from "./pages/dashboard/profilePage";
import LandingPage from "./pages/landing/landingPage";

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 items-center justify-center h-screen">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }
  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />} />
        {/* Protected Routes */}
        
        <Route element={<ProtectRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/documents/:id" element={<DocumentDetail />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        
      </Routes>
    </Router>
  )
}

export default App
