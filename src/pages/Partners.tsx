
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Search, Briefcase } from "lucide-react";

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

const Partners = () => {
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
        empresa.parceriasDesejadas.toLowerCase().includes(searchTerm.toLowerCase())
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
              <Link to="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Link to="/register">
                <Button>Cadastrar Empresa</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Encontre Parceiros Ideais
            </h2>
            <p className="text-gray-600">
              Descubra empresas compatíveis para formar parcerias estratégicas
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-8">
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
                    Buscar por nome ou descrição
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
                <Card key={empresa.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                      {empresa.nomeEmpresa}
                    </CardTitle>
                    <CardDescription>
                      {empresa.areaAtuacao} • {empresa.regiao}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
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
                          {empresa.parceriasDesejadas}
                        </p>
                      </div>

                      <div className="pt-4 border-t">
                        <Button className="w-full" variant="outline">
                          Entrar em Contato
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhuma empresa encontrada
                </h3>
                <p className="text-gray-600 mb-4">
                  Tente ajustar os filtros ou cadastre uma nova empresa
                </p>
                <Link to="/register">
                  <Button>Cadastrar Primeira Empresa</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Partners;
