import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function AuthWrapper({ children }) {
  const { loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  return children;
}
