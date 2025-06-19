
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Search, Briefcase, Building2, MapPin, Calendar } from "lucide-react";

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

export const CompaniesSearch = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [filteredEmpresas, setFilteredEmpresas] = useState<Empresa[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterArea, setFilterArea] = useState("");
  const [filterRegiao, setFilterRegiao] = useState("");

  useEffect(() => {
    const empresasData = JSON.parse(localStorage.getItem("empresas") || "[]");
    setEmpresas(empresasData);
    setFilteredEmpresas(empresasData);
  }, []);

  useEffect(() => {
    let filtered = empresas;

    if (searchTerm) {
      filtered = filtered.filter(empresa =>
        empresa.nomeEmpresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        empresa.areaAtuacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        empresa.parceriasDesejadas.toLowerCase().includes(searchTerm.toLowerCase()) ||
        empresa.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterArea) {
      filtered = filtered.filter(empresa =>
        empresa.areaAtuacao.toLowerCase().includes(filterArea.toLowerCase())
      );
    }

    if (filterRegiao) {
      filtered = filtered.filter(empresa =>
        empresa.regiao.toLowerCase().includes(filterRegiao.toLowerCase())
      );
    }

    setFilteredEmpresas(filtered);
  }, [searchTerm, filterArea, filterRegiao, empresas]);

  const areas = [...new Set(empresas.map(emp => emp.areaAtuacao))];
  const regioes = [...new Set(empresas.map(emp => emp.regiao))];

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">
                Buscar Empresas
              </h1>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline">Voltar ao Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Encontre Empresas Cadastradas
            </h2>
            <p className="text-gray-600">
              Explore todas as empresas registradas na plataforma
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-8 gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Filtros de Busca
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Buscar por nome, área ou descrição
                  </label>
                  <Input
                    placeholder="Digite aqui..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Área de Atuação
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={filterArea}
                    onChange={(e) => setFilterArea(e.target.value)}
                  >
                    <option value="">Todas as áreas</option>
                    {areas.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Região
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={filterRegiao}
                    onChange={(e) => setFilterRegiao(e.target.value)}
                  >
                    <option value="">Todas as regiões</option>
                    {regioes.map(regiao => (
                      <option key={regiao} value={regiao}>{regiao}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="mb-4">
            <p className="text-gray-600">
              {filteredEmpresas.length} empresa(s) encontrada(s)
            </p>
          </div>

          {filteredEmpresas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmpresas.map((empresa) => (
                <Card key={empresa.id} className="gradient-card hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      {empresa.nomeEmpresa}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      {Array.isArray(empresa.areaAtuacao) 
                        ? empresa.areaAtuacao.join(", ") 
                        : empresa.areaAtuacao}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{empresa.regiao}</span>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm text-gray-600">Tipo</h4>
                        <p className="text-sm">{empresa.tipoEstabelecimento}</p>
                      </div>
                      
                      {empresa.descricao && (
                        <div>
                          <h4 className="font-semibold text-sm text-gray-600">Sobre</h4>
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {empresa.descricao}
                          </p>
                        </div>
                      )}

                      <div>
                        <h4 className="font-semibold text-sm text-gray-600">Busca por</h4>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {Array.isArray(empresa.parceriasDesejadas) 
                            ? empresa.parceriasDesejadas.join(", ") 
                            : empresa.parceriasDesejadas}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          Cadastrado em {new Date(empresa.dataCadastro).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="pt-4 space-y-2">
                        <Link to={`/partners/chat?with=${empresa.id}`}>
                          <Button className="w-full gradient-primary text-white">
                            Iniciar Conversa
                          </Button>
                        </Link>
                        <Link to={`/business/products?empresaId=${empresa.id}`}>
                          <Button className="w-full" variant="outline">
                            Ver Produtos/Serviços
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="gradient-card">
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhuma empresa encontrada
                </h3>
                <p className="text-gray-600 mb-4">
                  Tente ajustar os filtros de busca
                </p>
                <Link to="/register">
                  <Button>Cadastrar Nova Empresa</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
