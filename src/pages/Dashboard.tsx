
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Briefcase, ChartBar, Database } from "lucide-react";

interface Empresa {
  id: number;
  nomeEmpresa: string;
  cnpj: string;
  areaAtuacao: string;
  tipoEstabelecimento: string;
  regiao: string;
  descricao: string;
  parceriasDesejadas: string;
  dataCadastro: string;
}

const Dashboard = () => {
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [todasEmpresas, setTodasEmpresas] = useState<Empresa[]>([]);
  const [parceriasPotenciais, setParceriasPotenciais] = useState<Empresa[]>([]);

  useEffect(() => {
    // Carregar dados da empresa atual
    const empresaAtual = localStorage.getItem("empresaAtual");
    if (empresaAtual) {
      setEmpresa(JSON.parse(empresaAtual));
    }

    // Carregar todas as empresas
    const empresas = JSON.parse(localStorage.getItem("empresas") || "[]");
    setTodasEmpresas(empresas);

    // Encontrar parcerias potenciais (empresas na mesma região ou área similar)
    if (empresaAtual) {
      const atual = JSON.parse(empresaAtual);
      const potenciais = empresas.filter((emp: Empresa) => 
        emp.id !== atual.id && 
        (emp.regiao.toLowerCase().includes(atual.regiao.toLowerCase()) ||
         emp.areaAtuacao.toLowerCase().includes(atual.areaAtuacao.toLowerCase()))
      );
      setParceriasPotenciais(potenciais);
    }
  }, []);

  if (!empresa) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Empresa não encontrada</CardTitle>
            <CardDescription>
              Você precisa cadastrar uma empresa primeiro
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link to="/register">
              <Button>Cadastrar Empresa</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link to="/" className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Connected Partners & Business
              </h1>
            </Link>
            <nav className="flex space-x-4">
              <Link to="/partners">
                <Button variant="outline">Buscar Parceiros</Button>
              </Link>
              <Link to="/register">
                <Button>Nova Empresa</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Bem-vindo, {empresa.nomeEmpresa}!
            </h2>
            <p className="text-gray-600">
              Acompanhe suas informações e descubra novas oportunidades de parceria
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Empresas Cadastradas
                </CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todasEmpresas.length}</div>
                <p className="text-xs text-muted-foreground">
                  Total na plataforma
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Parcerias Potenciais
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{parceriasPotenciais.length}</div>
                <p className="text-xs text-muted-foreground">
                  Empresas compatíveis
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Área de Atuação
                </CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{empresa.areaAtuacao}</div>
                <p className="text-xs text-muted-foreground">
                  Setor principal
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Região de Interesse
                </CardTitle>
                <ChartBar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{empresa.regiao}</div>
                <p className="text-xs text-muted-foreground">
                  Área de busca
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informações da Empresa</CardTitle>
                <CardDescription>
                  Dados cadastrais da sua empresa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Nome</h4>
                  <p className="text-lg">{empresa.nomeEmpresa}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">CNPJ</h4>
                  <p className="text-lg">{empresa.cnpj}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Tipo de Estabelecimento</h4>
                  <p className="text-lg">{empresa.tipoEstabelecimento}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Descrição</h4>
                  <p className="text-sm text-gray-700">{empresa.descricao || "Não informado"}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Parcerias Desejadas</h4>
                  <p className="text-sm text-gray-700">{empresa.parceriasDesejadas}</p>
                </div>
              </CardContent>
            </Card>

            {/* Potential Partners */}
            <Card>
              <CardHeader>
                <CardTitle>Parcerias Potenciais</CardTitle>
                <CardDescription>
                  Empresas que podem ser seus parceiros ideais
                </CardDescription>
              </CardHeader>
              <CardContent>
                {parceriasPotenciais.length > 0 ? (
                  <div className="space-y-4">
                    {parceriasPotenciais.slice(0, 3).map((parceiro) => (
                      <div key={parceiro.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <h4 className="font-semibold">{parceiro.nomeEmpresa}</h4>
                        <p className="text-sm text-gray-600">{parceiro.areaAtuacao}</p>
                        <p className="text-sm text-gray-500">{parceiro.regiao}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {parceiro.parceriasDesejadas.substring(0, 100)}...
                        </p>
                      </div>
                    ))}
                    <Link to="/partners">
                      <Button className="w-full">Ver Todas as Empresas</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">
                      Nenhuma parceria potencial encontrada ainda
                    </p>
                    <Link to="/partners">
                      <Button>Explorar Empresas</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
