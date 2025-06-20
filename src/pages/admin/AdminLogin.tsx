
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loginAdmin } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Credenciais fixas para demonstração
    if (formData.username === "admin" && formData.password === "admin123") {
      loginAdmin();
      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para o dashboard administrativo..."
      });
      
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1000);
    } else {
      toast({
        title: "Erro no login",
        description: "Usuário ou senha incorretos",
        variant: "destructive"
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/bad5c8be-c34c-4862-b6b3-b7ad10c24b65.png" 
                alt="Connected Partners & Business Logo" 
                className="h-10 w-10 object-contain"
              />
              <h1 className="text-xl font-bold text-gray-900">
                Connected Partners & Business
              </h1>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline">Voltar ao Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="gradient-card">
            <CardHeader className="text-center">
              <Settings className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-2xl text-primary">Acesso Administrativo</CardTitle>
              <CardDescription>
                Entre com suas credenciais de administrador
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="username">Usuário</Label>
                  <Input 
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Digite seu usuário"
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Senha</Label>
                  <Input 
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Digite sua senha"
                  />
                </div>

                <Button type="submit" className="w-full gradient-primary text-white" size="lg">
                  Fazer Login
                </Button>
              </form>
              
              <div className="mt-4 text-center text-sm text-gray-600">
                <p>Credenciais para demonstração:</p>
                <p>Usuário: <code className="bg-gray-100 px-1 rounded">admin</code></p>
                <p>Senha: <code className="bg-gray-100 px-1 rounded">admin123</code></p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
