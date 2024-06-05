import React, {
  useState,
  useRef,
  createContext,
  Dispatch,
  SetStateAction,
  ReactElement,
  MutableRefObject,
  useEffect,
} from "react";

interface AuthenticateContextType {
  isLogin: boolean;
  setIsLogin: Dispatch<SetStateAction<boolean>>;
  role?: MutableRefObject<number>;
  login: (username: string, password: string) => void;
  logout: () => void;
  id?: MutableRefObject<number | undefined>;
  displayName?: MutableRefObject<string | undefined>;
}

export const AuthenticateContext = createContext<AuthenticateContextType>({
  isLogin: false,
  setIsLogin: () => {},
  role: undefined,
  login: () => {},
  logout: () => {},
  id: undefined,
  displayName: undefined,
});

const getUser = async (username: string, password: string) => {
  const response = await fetch("http://localhost:4000/security/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  return data;
};

// Also can be write as : AuthenticateProvider: React.FC<{children: ReactElement}> = ({ children }) => {}
export const AuthenticateProvider = ({ children }: { children: ReactElement }) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const role = useRef<number>(0);
  const id = useRef<number | undefined>(undefined);
  const displayName = useRef<string | undefined>(undefined);

  const logout = () => {
    role.current = 0;
    id.current = undefined;
    displayName.current = undefined;
    setIsLogin(false);
  };

  const login = (username: string, password: string) => {
    getUser(username, password).then((data) => {
      if (data[0].isActive === 1 && data[0].isBanned === 0) {
        setIsLogin(true);
        id.current = data[0].id;
        displayName.current = data[0].username;
        role.current = 1;
        if (data[0].role === "a") {
          role.current = 2;
        }
      }
    });
  };

  useEffect(() => {}, []);

  return (
    <AuthenticateContext.Provider
      value={{
        isLogin,
        setIsLogin,
        role,
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
