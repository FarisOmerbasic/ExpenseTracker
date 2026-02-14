import {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { User, LoginRequestDto, CreateUserDto } from '../types';
import { authService } from '../services/authService';
import { isTokenExpired } from '../utils/helpers';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequestDto) => Promise<void>;
  register: (data: CreateUserDto) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('user');
      const token = localStorage.getItem('accessToken');
      if (saved && token && !isTokenExpired(token)) return JSON.parse(saved);
    } catch {}
    return null;
  });
  const [token, setToken] = useState<string | null>(() => {
    const saved = localStorage.getItem('accessToken');
    if (saved && !isTokenExpired(saved)) return saved;
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('accessToken');
    if (savedToken && isTokenExpired(savedToken)) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (data: LoginRequestDto) => {
    const res = await authService.login(data);
    const { accessToken, user: loggedInUser } = res.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setToken(accessToken);
    setUser(loggedInUser);
    toast.success(`Welcome back, ${loggedInUser.name}!`);
  }, []);

  const register = useCallback(async (data: CreateUserDto) => {
    const res = await authService.register(data);
    const { accessToken, user: newUser } = res.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(accessToken);
    setUser(newUser);
    toast.success('Account created successfully!');
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    toast.success('Logged out');
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
