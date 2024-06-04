import React, { useState, createContext, Dispatch, SetStateAction, ReactElement } from "react";

interface AuthenticateContextType {
  isLogin: boolean;
  setIsLogin: Dispatch<SetStateAction<boolean>>;
  role: number;
  setRole: Dispatch<SetStateAction<number>>;
  login: (username: string, password: string) => void;
  logout: () => void;
  id?: number;
  displayName?: string;
}

export const AuthenticateContext = createContext<AuthenticateContextType>({
  isLogin: false,
  setIsLogin: () => {},
  role: 0,
  setRole: () => {},
  login: (username: string, password: string) => {},
  logout: () => {},
  id: undefined,
  displayName: undefined,
});

const getUser = async (username: string, password: string) => {
  const response = await fetch("http://localhost:4000/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json();
  return data;
};

export const AuthenticateProvider = ({ children }: { children: ReactElement }) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [role, setRole] = useState<number>(0);
  let id = undefined;
  let displayName = undefined;

  const logout = () => {
    setIsLogin(false);
    setRole(0);
  };

  const login = (username: string, password: string) => {
    getUser(username, password).then((data) => {
      if (data.status === "success") {
        setIsLogin(true);
        id = data[0].id;
        displayName = data[0].username;
        setRole(1);
        if (data[0].role === "a") {
          setRole(2);
        }
      }
    });
  };

  return (
    <AuthenticateContext.Provider
      value={{
        isLogin,
        setIsLogin,
        role,
        setRole,
        login,
        logout,
        id,
        displayName,
      }}
    >
      {children}
    </AuthenticateContext.Provider>
  );
};
