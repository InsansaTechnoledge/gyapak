import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // For normal logged-in user from API
  const [electronUserData, setElectronUserData] = useState(null); // For userId, examId, eventId from Electron

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      electronUserData, 
      setElectronUserData 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
