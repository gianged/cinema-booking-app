import React, { ReactElement, useContext } from "react";
import { AuthenticateContext } from "../contexts/AuthenticateContext";

export const AdminChecking: React.FC<{ children: ReactElement }> = ({ children }) => {
  const authenticate = useContext(AuthenticateContext);

  return authenticate.role?.current === 2 ? (
    children
  ) : (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>403 - Forbidden</h1>
      <p>You do not have permission to access this page.</p>
    </div>
  );
};
