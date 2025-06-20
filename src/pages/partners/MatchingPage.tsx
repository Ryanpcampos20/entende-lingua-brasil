
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, MapPin, Building, MessageCircle, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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

interface Match {
  empresa: Empresa;
  score: number;
  motivo: string;
}

const MatchingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/dashboard");
      return;
    }

    // Simular carregamento de matches
    setTimeout(() => {
      const empresasData = localStorage.getItem("empresas");
      if (empresasData) {
        const empresas: Empresa[] = JSON.parse(empresasData);
        const matchesCalculados = calcularMatches(empresas, user);
        setMatches(matchesCalculados);
      }
      setLoading(false);
    }, 1000);
  }, [user, navigate]);

  const calcularMatches = (empresas: Empresa[], usuarioAtual: any): Match[] => {
    return empresas
      .filter(empresa => empresa.id !== usuarioAtual.id)
      .map(empresa => {
        let score = 0;
        let motivos = [];

        // Match por setor complementar
        if (empresa.areaAtuacao === usuarioAtual.parceriasDesejadas && 
            empresa.parceriasDesejadas === usuarioAtual.areaAtuacao) {
          score += 90;
          motivos.push("Match perfeito de setores");
        } else if (empresa.parceriasDesejadas === usuarioAtual.areaAtuacao) {
          score += 70;
          motivos.push("Interessado no seu setor");
        } else if (empresa.areaAtuacao === usuarioAtual.parceriasDesejadas) {
          score += 60;
          motivos.push("Atua no setor de seu interesse");
        }

        // Match por região
        if (empresa.regiao.toLowerCase() === usuarioAtual.regiao.toLowerCase()) {
          score += 20;
          motivos.push("Mesma região");
        } else if (empresa.regiao.toLowerCase().includes("nacional") || 
                   usuarioAtual.regiao.toLowerCase().includes("nacional")) {
          score += 15;
          motivos.push("Atuação nacional");
        }

        // Match por tipo de estabelecimento
        if (empresa.tipoEstabelecimento !== usuarioAtual.tipoEstabelecimento) {
          score += 10;
          motivos.push("Tipos complementares");
        }

        return {
          empresa,
          score: Math.min(score, 100),
          motivo: motivos.join(", ") || "Potencial parceria"
        };
      })
      .filter(match => match.score > 0)
      .sort((a, b) => b.score - a.score);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-blue-600 bg-blue-100";
    if (score >= 40) return "text-yellow-600 bg-yellow-100";
    return "text-gray-600 bg-gray-100";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excelente";
    if (score >= 60) return "Bom";
    if (score >= 40) return "Moderado";
    return "Baixo";
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Calculando matches...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link to="/dashboard" className="mr-4">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/bad5c8be-c34c-4862-b6b3-b7ad10c24b65.png" 
                alt="Connected Partners & Business Logo" 
                className="h-8 w-8 object-contain"
              />
              <h1 className="text-xl font-bold text-gray-900">
                Matchmaking Inteligente
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Empresas com Potencial de Parceria
          </h2>
          <p className="text-gray-600 mb-4">
            Baseado nos seus interesses de parceria e complementaridade de setores
          </p>
          
          {/* User Info Card */}
          <Card className="gradient-card mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-primary">{user?.nomeEmpresa}</h3>
                  <p className="text-sm text-gray-600">
                    Atua em: <span className="font-medium">{user?.areaAtuacao}</span> | 
                    Busca parceria em: <span className="font-medium">{user?.parceriasDesejadas}</span>
                  </p>
                </div>
                <Badge className="bg-primary text-white">
                  {matches.length} matches encontrados
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Matches List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {matches.length === 0 ? (
            <div className="col-span-full">
              <Card className="gradient-card">
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhum match encontrado
                  </h3>
                  <p className="text-gray-600">
                    Ainda não há empresas compatíveis com seus critérios de parceria.
                    Tente novamente mais tarde.
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            matches.map((match) => (
              <Card key={match.empresa.id} className="gradient-card hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-primary mb-2">
                        {match.empresa.nomeEmpresa}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={`${getScoreColor(match.score)} border-0`}>
                          <Star className="h-3 w-3 mr-1" />
                          {getScoreLabel(match.score)} ({match.score}%)
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-sm">
                    {match.motivo}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Área de Atuação:</p>
                      <p className="font-medium text-primary">{match.empresa.areaAtuacao}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Busca Parceria:</p>
                      <p className="font-medium text-accent">{match.empresa.parceriasDesejadas}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {match.empresa.regiao}
                    </div>
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-1" />
                      {match.empresa.tipoEstabelecimento}
                    </div>
                  </div>
                  
                  {match.empresa.descricao && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {match.empresa.descricao}
                    </p>
                  )}
                  
                  <div className="flex space-x-2 pt-2">
                    <Link to={`/chat?with=${match.empresa.id}`}>
                      <Button className="flex-1 gradient-primary text-white" size="sm">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Iniciar Chat
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm">
                      Ver Perfil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchingPage;
