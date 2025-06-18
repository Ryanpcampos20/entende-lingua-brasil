import React from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Building2, Users, UserPlus, ArrowRight } from 'lucide-react';

export const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Simulando dados de empresas
  const empresas = JSON.parse(localStorage.getItem("empresas") || "[]");
  
  const estatisticas = {
    totalEmpresas: empresas.length,
    novasEmpresasHoje: empresas.filter((empresa: any) => {
      const diasDesdecadastro = Math.floor((Date.now() - new Date(empresa.dataCadastro).getTime()) / (1000 * 60 * 60 * 24));
      return diasDesdecadastro === 0;
    }).length,
    areaMaisComum: () => {
      const areas = empresas.map((empresa: any) => empresa.areaAtuacao);
      const contagemAreas: { [key: string]: number } = {};
      areas.forEach(area => {
        contagemAreas[area] = (contagemAreas[area] || 0) + 1;
      });
      let areaMaisComum = "";
      let maxContagem = 0;
      for (const area in contagemAreas) {
        if (contagemAreas[area] > maxContagem) {
          areaMaisComum = area;
          maxContagem = contagemAreas[area];
        }
      }
      return areaMaisComum;
    },
    mediaParceriasDesejadas: () => {
      if (empresas.length === 0) return 0;
      const totalParcerias = empresas.reduce((total: number, empresa: any) => total + empresa.parceriasDesejadas.length, 0);
      return totalParcerias / empresas.length;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <Button variant="destructive" onClick={handleLogout}>Logout</Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-gray-500" />
                Total de Empresas
              </CardTitle>
              <CardDescription>Número total de empresas cadastradas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{estatisticas.totalEmpresas}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-gray-500" />
                Novas Empresas Hoje
              </CardTitle>
              <CardDescription>Empresas que se cadastraram nas últimas 24 horas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{estatisticas.novasEmpresasHoje}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-gray-500" />
                Área de Atuação Mais Comum
              </CardTitle>
              <CardDescription>Setor com maior número de empresas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold">{estatisticas.areaMaisComum()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-500" />
                Média de Parcerias Desejadas
              </CardTitle>
              <CardDescription>Média de parcerias que as empresas buscam</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{estatisticas.mediaParceriasDesejadas().toFixed(1)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Empresas Cadastradas */}
        <div className="bg-white shadow overflow-hidden rounded-md">
          <ul className="divide-y divide-gray-200">
            {empresas.map((empresa: any) => (
              <li key={empresa.id}>
                <Link to={`/business/products?empresaId=${empresa.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">{empresa.nomeEmpresa}</p>
                      <div className="ml-2 flex-shrink-0">
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <Building2 className="mr-1.5 h-5 w-5 text-gray-400 flex-shrink-0" />
                          {empresa.areaAtuacao}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <CalendarDays className="mr-1.5 h-5 w-5 text-gray-400 flex-shrink-0" />
                        <p>
                          Cadastrado em {new Date(empresa.dataCadastro).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};
