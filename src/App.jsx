import { BrowserRouter as Router } from "react-router-dom";
import AuthContextProvider from "./context/AuthContext";
import RoutesFile from "./routes/RoutesFile";
import SearchContextProvider from "./context/searchContext";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AppWrapper() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!userEmail) {
      navigate("/login");
      return;
    }

    const checkStatus = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/users?email=${userEmail}`
        );
        const user = res.data[0];
        if (user?.status === "active") {
          navigate("/");
        } else if (user?.status === "blocked") {
          navigate("/blockedpage");
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkStatus();
  }, [userEmail]);

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
