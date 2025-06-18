
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  nomeEmpresa: string;
  cnpj: string;
  areaAtuacao: string;
  tipoEstabelecimento: string;
  regiao: string;
  descricao: string;
  parceriasDesejadas: string;
  dataCadastro: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (userData: User) => void;
  logout: () => void;
  loginAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const savedUser = localStorage.getItem('empresaAtual');
    const savedAdmin = localStorage.getItem('isAdmin');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedAdmin === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('empresaAtual', JSON.stringify(userData));
  };

  const loginAdmin = () => {
    setIsAdmin(true);
    localStorage.setItem('isAdmin', 'true');
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('empresaAtual');
    localStorage.removeItem('isAdmin');
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout, loginAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
