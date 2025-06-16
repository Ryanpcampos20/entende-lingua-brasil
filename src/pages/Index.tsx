
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Users, Briefcase, ChartBar } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Connected Partners & Business
              </h1>
            </div>
            <nav className="flex space-x-4">
              <Link to="/register">
                <Button variant="outline">Cadastrar Empresa</Button>
              </Link>
              <Link to="/dashboard">
                <Button>Acessar Dashboard</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
            Conecte sua empresa às melhores
            <span className="text-blue-600"> parcerias empresariais</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A plataforma que conecta empresas brasileiras para formar parcerias estratégicas, 
            expandir negócios e criar oportunidades de crescimento mútuo.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register">
              <Button size="lg" className="px-8 py-3">
                Cadastrar Minha Empresa
              </Button>
            </Link>
            <Link to="/partners">
              <Button variant="outline" size="lg" className="px-8 py-3">
                Encontrar Parceiros
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Como Funciona
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Briefcase className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Cadastre sua Empresa</CardTitle>
                <CardDescription>
                  Registre informações básicas como CNPJ, área de atuação e tipo de estabelecimento
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Encontre Parceiros</CardTitle>
                <CardDescription>
                  Nossa plataforma conecta sua empresa com parceiros ideais na sua região de interesse
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <ChartBar className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Acompanhe Resultados</CardTitle>
                <CardDescription>
                  Dashboard completo com dados da empresa, interações e oportunidades de parceria
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Pronto para expandir seus negócios?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Junte-se a centenas de empresas que já encontraram seus parceiros ideais
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="px-8 py-3">
              Começar Agora - É Grátis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-2">
            <Users className="h-6 w-6" />
            <span className="text-lg font-semibold">Connected Partners & Business</span>
          </div>
          <p className="text-center text-gray-400 mt-4">
            Conectando empresas brasileiras para um futuro próspero
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
