import React, { ReactElement, useContext } from "react";
import { AuthenticateContext } from "../contexts/AuthenticateContext";
import { Link } from "react-router-dom";

export const AdminChecking: React.FC<{ children: ReactElement }> = ({children}) => {
    const authenticate = useContext(AuthenticateContext);

    return authenticate.role?.current === 2 ? (
        children
    ) : (
        <div style={{textAlign: "center", marginTop: "50px"}}>
            <h1>403 - Forbidden</h1>
            <p>You do not have permission to access this page.</p>
            <Link to="/">Back to home</Link>
        </div>
    );
};
