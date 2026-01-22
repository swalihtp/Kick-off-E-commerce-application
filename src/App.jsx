import { BrowserRouter as Router } from "react-router-dom";
import AuthContextProvider from "./context/AuthContext";
import RoutesFile from "./Routes/RoutesFile";
import SearchContextProvider from "./context/searchContext";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

function AppWrapper() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");

  // useEffect(() => {
  // }, [userEmail]);

  return <RoutesFile />;
}

function App() {
  return (
    <AuthContextProvider>
      <SearchContextProvider>
        <Router>
          <AppWrapper />
        </Router>
      </SearchContextProvider>
    </AuthContextProvider>
  );
}

export default App;
