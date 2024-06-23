import React, { ReactElement, useContext, useEffect } from "react";
import { AuthenticateContext } from "../contexts/AuthenticateContext";
import { useNavigate } from "react-router-dom";

export const UserChecking: React.FC<{ children: ReactElement }> = ({ children }) => {
  const authenticate = useContext(AuthenticateContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authenticate.isLogin) {
      navigate("/login");
    }
  });

  return <>{children}</>;
};
