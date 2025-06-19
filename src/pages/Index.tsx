import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Briefcase, ChartBar, Users, Handshake, MessageCircle, ShoppingBag, Calendar, User } from "lucide-react";

const Index = () => {
  // Simulando posts do blog do localStorage
  const blogPosts = JSON.parse(localStorage.getItem("blogPosts") || "[]").slice(0, 3);

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-6">
              <img 
                src="/lovable-uploads/6e4f1017-6bad-4cc1-a450-27f5919b2498.png" 
                alt="Connected Partners & Business Logo" 
                className="h-28 w-28 object-contain drop-shadow-lg filter brightness-110 contrast-125"
              />
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                Connected Partners & Business
              </h1>
            </div>
            <nav className="flex space-x-4">
              <Link to="/login">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  Cadastrar Empresa
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button className="gradient-primary text-white">
                  Acessar Dashboard
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-8">
            <img 
              src="/lovable-uploads/6e4f1017-6bad-4cc1-a450-27f5919b2498.png" 
              alt="Connected Partners & Business Logo" 
              className="h-40 w-40 object-contain drop-shadow-2xl filter brightness-110 contrast-125"
            />
          </div>
          <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
            Conecte sua empresa às melhores
            <span className="text-primary"> parcerias empresariais</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A plataforma que conecta empresas brasileiras para formar parcerias estratégicas, 
            expandir negócios e criar oportunidades de crescimento mútuo através de matchmaking inteligente.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register">
              <Button size="lg" className="px-8 py-3 gradient-primary text-white">
                Cadastrar Minha Empresa
              </Button>
            </Link>
            <Link to="/partners">
              <Button variant="outline" size="lg" className="px-8 py-3 border-primary text-primary hover:bg-primary hover:text-white">
                Encontrar Parceiros
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Plataforma Completa para Parcerias e Negócios
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center gradient-card border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Handshake className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-primary">Matchmaking Inteligente</CardTitle>
                <CardDescription>
                  Algoritmo avançado conecta empresas com base em complementaridade de setores e interesses mútuos
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center gradient-card border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <MessageCircle className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle className="text-primary">Chat Privado</CardTitle>
                <CardDescription>
                  Comunicação direta entre empresas com possibilidade de solicitar intermediação de consultores especializados
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center gradient-card border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <ShoppingBag className="h-12 w-12 text-secondary mx-auto mb-4" />
                <CardTitle className="text-primary">Módulo de Negócios</CardTitle>
                <CardDescription>
                  Vitrine de produtos/serviços e sistema de cotações para demandas específicas com verba alocada
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center gradient-card border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Briefcase className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-primary">Cadastro Segmentado</CardTitle>
                <CardDescription>
                  Registre informações detalhadas como CNPJ, área de atuação e setores de interesse para parcerias
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center gradient-card border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle className="text-primary">Gestão Administrativa</CardTitle>
                <CardDescription>
                  Dashboard completo para administradores gerenciarem contas, conexões e intermediações
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center gradient-card border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <ChartBar className="h-12 w-12 text-secondary mx-auto mb-4" />
                <CardTitle className="text-primary">Relatórios e Analytics</CardTitle>
                <CardDescription>
                  Acompanhe resultados, interações e oportunidades de parceria através de relatórios detalhados
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      {blogPosts.length > 0 && (
        <section className="py-16 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Blog - Educação Empresarial
              </h3>
              <p className="text-xl text-gray-600">
                Conteúdos exclusivos para ajudar sua empresa a crescer e formar parcerias estratégicas
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {blogPosts.map((post: any) => (
                <Card key={post.id} className="gradient-card border-blue-100 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(post.createdAt).toLocaleDateString()}
                      <User className="h-4 w-4 ml-4 mr-1" />
                      {post.author}
                    </div>
                    <CardTitle className="text-primary line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
            <div className="text-center">
              <Link to="/blog">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  Ver Todos os Posts
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Modules Section */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Dois Módulos Especializados
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="gradient-card border-primary/20 hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <Handshake className="h-16 w-16 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl text-primary">Módulo Parceiros</CardTitle>
                <CardDescription className="text-lg">
                  Foco em networking e formação de parcerias estratégicas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Matchmaking baseado em setores complementares</li>
                  <li>• Chat privado entre empresas</li>
                  <li>• Solicitação de intermediação de consultores</li>
                  <li>• Sistema de scoring de compatibilidade</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="gradient-card border-secondary/20 hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <ShoppingBag className="h-16 w-16 text-secondary mx-auto mb-4" />
                <CardTitle className="text-2xl text-primary">Módulo Negócios</CardTitle>
                <CardDescription className="text-lg">
                  Transações comerciais diretas com verba alocada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Cadastro de produtos e serviços</li>
                  <li>• Sistema de cotações segmentado</li>
                  <li>• Vitrine de ofertas por categoria</li>
                  <li>• Contato direto para negociações</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gradient-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Pronto para expandir seus negócios?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Junte-se a centenas de empresas que já encontraram seus parceiros ideais através da nossa plataforma
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="px-8 py-3 bg-white text-primary hover:bg-gray-100">
              Começar Agora - É Grátis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-4">
            <img 
              src="/lovable-uploads/6e4f1017-6bad-4cc1-a450-27f5919b2498.png" 
              alt="Connected Partners & Business Logo" 
              className="h-16 w-16 object-contain filter brightness-110 contrast-125"
            />
            <span className="text-xl font-semibold">Connected Partners & Business</span>
          </div>
          <p className="text-center text-gray-400 mt-4">
            Conectando empresas brasileiras para um futuro próspero através de parcerias estratégicas
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
