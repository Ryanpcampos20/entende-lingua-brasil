
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

export const ProtectedRoute = ({ children, fallbackPath = '/login' }: ProtectedRouteProps) => {
  const { user, loading } = useSupabaseAuth();

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Carregando...</CardTitle>
            <CardDescription>
              Verificando autenticação...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};
