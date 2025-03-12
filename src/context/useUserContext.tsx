
import { createContext, useContext } from "react";
import { UserContextType } from "./UserTypes";

// Create the context with initial values
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook for accessing the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
