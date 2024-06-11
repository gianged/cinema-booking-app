import React, { ReactElement, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthenticateContext } from "../contexts/AuthenticateContext";

export const AdminChecking: React.FC<{ children: ReactElement }> = ({ children }) => {
  const authenticate = useContext(AuthenticateContext);
  const navigate = useNavigate();

  return authenticate.role?.current === 2 ? (
    children
  ) : (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>403 - Forbidden</h1>
      <p>You do not have permission to access this page.</p>
    </div>
  );
};
