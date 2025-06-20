
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { Users, Handshake, ShoppingBag, Settings, LogOut, MessageCircle, TrendingUp, Building2 } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const Dashboard = () => {
  const { user, profile, signOut } = useSupabaseAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    matches: 0,
    conversas: 0,
    produtos: 0,
    cotacoes: 0
  });
  
  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  // Calcular estatísticas dinâmicas baseadas no usuário logado
  useEffect(() => {
    if (user && profile) {
      fetchStats();
    }
  }, [user, profile]);

  const fetchStats = async () => {
    try {
      // Calcular matches usando a função do Supabase
      const { data: matchesData } = await supabase.rpc('calculate_matches', {
        user_id: user?.id
      });
      
      // Calcular conversas
      const { count: conversasCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`);

      // Calcular produtos
      const { count: produtosCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);
      
      // Calcular cotações
      const { count: cotacoesCount } = await supabase
        .from('quotes')
        .select('*', { count: 'exact', head: true })
        .eq('solicitante_id', user?.id);

      setStats({
        matches: matchesData?.length || 0,
        conversas: conversasCount || 0,
        produtos: produtosCount || 0,
        cotacoes: cotacoesCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <ProtectedRoute>
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
              <div className="flex items-center space-x-4">
                <Link to="/business/companies">
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Buscar Empresas
                  </Button>
                </Link>
                <span className="text-sm text-gray-600">
                  {profile?.nome_empresa || 'Usuário'}
                </span>
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
              Bem-vindo, {profile?.nome_empresa || 'Usuário'}!
            </h2>
            <p className="text-gray-600">
              Gerencie suas parcerias e negócios através dos módulos especializados
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="gradient-card">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Handshake className="h-8 w-8 text-primary" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Matches Disponíveis</p>
                    <p className="text-2xl font-bold text-primary">{stats.matches}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="gradient-card">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <MessageCircle className="h-8 w-8 text-accent" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Conversas</p>
                    <p className="text-2xl font-bold text-accent">{stats.conversas}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="gradient-card">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <ShoppingBag className="h-8 w-8 text-secondary" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Produtos</p>
                    <p className="text-2xl font-bold text-secondary">{stats.produtos}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="gradient-card">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Cotações</p>
                    <p className="text-2xl font-bold text-green-600">{stats.cotacoes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Modules */}
          <Tabs defaultValue="partners" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="partners" className="flex items-center space-x-2">
                <Handshake className="h-4 w-4" />
                <span>Parceiros</span>
              </TabsTrigger>
              <TabsTrigger value="business" className="flex items-center space-x-2">
                <ShoppingBag className="h-4 w-4" />
                <span>Negócios</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="partners" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="gradient-card hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center text-primary">
                      <Users className="h-5 w-5 mr-2" />
                      Matchmaking Inteligente
                    </CardTitle>
                    <CardDescription>
                      Encontre empresas com potencial de parceria baseado em complementaridade de setores
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to="/partners/matching">
                      <Button className="w-full gradient-primary text-white">
                        Ver Matches Disponíveis
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="gradient-card hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center text-primary">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Chat e Comunicação
                    </CardTitle>
                    <CardDescription>
                      Converse diretamente com empresas parceiras e solicite intermediação
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to="/partners">
                      <Button className="w-full" variant="outline">
                        Ver Empresas para Chat
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="gradient-card hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center text-primary">
                      <Building2 className="h-5 w-5 mr-2" />
                      Buscar Empresas
                    </CardTitle>
                    <CardDescription>
                      Explore todas as empresas cadastradas na plataforma
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to="/business/companies">
                      <Button className="w-full" variant="outline">
                        Explorar Empresas
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>

              {profile && (
                <Card className="gradient-card">
                  <CardHeader>
                    <CardTitle className="text-primary">Suas Informações de Parceria</CardTitle>
                    <CardDescription>
                      Dados utilizados para o matchmaking
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Área de Atuação</p>
                      <p className="text-lg font-semibold text-primary">{profile.area_atuacao}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Parceria Desejada</p>
                      <p className="text-lg font-semibold text-accent">{profile.parcerias_desejadas}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Região</p>
                      <p className="text-lg font-semibold text-gray-900">{profile.regiao}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Tipo de Estabelecimento</p>
                      <p className="text-lg font-semibold text-gray-900">{profile.tipo_estabelecimento}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="business" className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ShoppingBag className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Módulo Negócios - Importante
                    </h3>
                    <p className="mt-1 text-sm text-yellow-700">
                      Esta aba é exclusivamente para negociações onde já existe uma dor identificada e necessidade 
                      de atendimento para o produto ou serviço com verba alocada para tal atividade.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="gradient-card hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center text-primary">
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      Meus Produtos/Serviços
                    </CardTitle>
                    <CardDescription>
                      Gerencie sua vitrine de produtos e serviços com preços
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to="/business/products">
                      <Button className="w-full gradient-primary text-white">
                        Gerenciar Produtos
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="gradient-card hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center text-primary">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Sistema de Cotações
                    </CardTitle>
                    <CardDescription>
                      Crie e responda solicitações de cotação por setor
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to="/business/quotes">
                      <Button className="w-full" variant="outline">
                        Acessar Cotações
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
