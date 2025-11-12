import React, {
  createContext,
  Dispatch,
  MutableRefObject,
  ReactElement,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useCookies } from 'react-cookie';
import { api } from '../services/api';

interface AuthenticateContextType {
  isLogin: boolean;
  setIsLogin: Dispatch<SetStateAction<boolean>>;
  role?: MutableRefObject<number>;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  id?: MutableRefObject<number | undefined>;
  displayName?: MutableRefObject<string | undefined>;
  loginError: string | null;
  setLoginError: Dispatch<SetStateAction<string | null>>;
}

export const AuthenticateContext = createContext<AuthenticateContextType>({
  isLogin: false,
  setIsLogin: () => {},
  role: undefined,
  login: async () => false,
  logout: () => {},
  id: undefined,
  displayName: undefined,
  loginError: null,
  setLoginError: () => {},
});

export const AuthenticateProvider = ({ children }: { children: ReactElement }) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const role = useRef<number>(0);
  const id = useRef<number | undefined>(undefined);
  const displayName = useRef<string | undefined>(undefined);
  const [authenticateCookie, setAuthenticateCookie, removeAuthenticateCookie] = useCookies([
    'authenticate',
  ]);
  const [loginError, setLoginError] = useState<string | null>(null);

  const logout = () => {
    role.current = 0;
    id.current = undefined;
    displayName.current = undefined;
    setIsLogin(false);
    removeAuthenticateCookie('authenticate');
    api.logout();
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await api.login(username, password);

      if (!response.user || !response.user.id) {
        setLoginError('Username or password is incorrect');
        return false;
      }

      if (response.user.isActive === 0) {
        setLoginError('Your account is disabled');
        return false;
      }

      // Login successful
      setLoginError(null);
      setIsLogin(true);
      id.current = response.user.id;
      displayName.current = response.user.username;
      role.current = 1;

      if (response.user.role === 'a') {
        role.current = 2;
      }

      setAuthenticateCookie('authenticate', {
        id: id.current,
        displayName: displayName.current,
        role: role.current,
      });

      return true;
    } catch (error: any) {
      setLoginError(error.message || 'Login failed. Please try again.');
      return false;
    }
  };

  useEffect(() => {
    if (authenticateCookie.authenticate) {
      id.current = authenticateCookie.authenticate.id;
      displayName.current = authenticateCookie.authenticate.displayName;
      role.current = authenticateCookie.authenticate.role;
      setIsLogin(true);
    }
  }, [authenticateCookie.authenticate]);

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
        loginError,
        setLoginError,
      }}
    >
      {children}
    </AuthenticateContext.Provider>
  );
};
