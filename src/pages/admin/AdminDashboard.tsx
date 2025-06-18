
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { Users, Settings, LogOut, Building, MessageCircle, TrendingUp, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Empresa {
  id: number;
  nomeEmpresa: string;
  cnpj: string;
  areaAtuacao: string;
  tipoEstabelecimento: string;
  regiao: string;
  parceriasDesejadas: string;
  dataCadastro: string;
}

const AdminDashboard = () => {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin/login");
      return;
    }

    // Carregar empresas do localStorage
    const empresasData = localStorage.getItem("empresas");
    if (empresasData) {
      setEmpresas(JSON.parse(empresasData));
    }
  }, [isAdmin, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getStatusColor = (empresa: Empresa) => {
    // Lógica simples para status baseado na data de cadastro
    const cadastro = new Date(empresa.dataCadastro);
    const agora = new Date();
    const diasDesdecadastro = Math.floor((agora.getTime() - cadastro.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diasDesdecastro < 7) return "bg-green-100 text-green-800";
    if (diasDesdecastro < 30) return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  const getStatusText = (empresa: Empresa) => {
    const cadastro = new Date(empresa.dataCadastro);
    const agora = new Date();
    const diasDesdecastro = Math.floor((agora.getTime() - cadastro.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diasDesdecastro < 7) return "Novo";
    if (diasDesdecastro < 30) return "Ativo";
    return "Estabelecido";
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/e8102e8e-a33f-4a70-84ed-a1efec461924.png" 
                alt="Connected Partners & Business Logo" 
                className="h-10 w-10 object-contain"
              />
              <h1 className="text-xl font-bold text-gray-900">
                Admin - Connected Partners & Business
              </h1>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Administrador</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Painel Administrativo
          </h2>
          <p className="text-gray-600">
            Gerencie todas as empresas, conexões e intermediações da plataforma
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Empresas Cadastradas</p>
                  <p className="text-2xl font-bold text-primary">{empresas.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-accent" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Matches Ativos</p>
                  <p className="text-2xl font-bold text-accent">24</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageCircle className="h-8 w-8 text-secondary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Intermediações</p>
                  <p className="text-2xl font-bold text-secondary">7</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Negócios Ativos</p>
                  <p className="text-2xl font-bold text-green-600">15</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Intermediations Alert */}
        <Card className="mb-8 border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-yellow-800">
                  Solicitações de Intermediação Pendentes
                </h3>
                <p className="text-yellow-700">
                  Você tem 3 solicitações de intermediação aguardando sua análise
                </p>
                <Button className="mt-2" variant="outline" size="sm">
                  Ver Solicitações
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Companies List */}
        <Card className="gradient-card">
          <CardHeader>
            <CardTitle className="text-primary">Empresas Cadastradas</CardTitle>
            <CardDescription>
              Todas as empresas registradas na plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {empresas.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Nenhuma empresa cadastrada ainda
                </p>
              ) : (
                empresas.map((empresa) => (
                  <div key={empresa.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white/60">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-900">{empresa.nomeEmpresa}</h3>
                        <Badge className={getStatusColor(empresa)}>
                          {getStatusText(empresa)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">CNPJ: {empresa.cnpj}</p>
                      <div className="flex space-x-4 mt-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {empresa.areaAtuacao}
                        </span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Interesse: {empresa.parceriasDesejadas}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          {empresa.regiao}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                      <Button variant="outline" size="sm">
                        Gerenciar
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
