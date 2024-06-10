import React, { ReactElement, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthenticateContext } from "../contexts/AuthenticateContext";

export const AdminChecking: React.FC<{ children: ReactElement }> = ({ children }) => {
  const authenticate = useContext(AuthenticateContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticate.role?.current !== 2) {
      navigate("/");
    }
  }, [authenticate.role, navigate]);

  return <>{children}</>;
};
