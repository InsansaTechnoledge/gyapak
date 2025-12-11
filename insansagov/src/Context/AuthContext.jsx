import { createContext, useState } from "react";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const authenticateHandler = () => {
    setIsAuthenticated(!isAuthenticated);
  };
  return (
    <AuthContext.Provider value={{ isAuthenticated, authenticateHandler }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
