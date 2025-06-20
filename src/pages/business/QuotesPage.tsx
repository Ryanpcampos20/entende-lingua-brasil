
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, MessageSquare } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

interface Cotacao {
  id: string;
  titulo: string;
  descricao: string;
  setor: string;
  orcamento: string;
  prazo: string;
  status: 'aberta' | 'em_analise' | 'fechada';
  solicitante: {
    id: string;
    nome: string;
    empresa: string;
  };
  respostas: CotacaoResposta[];
  dataCriacao: string;
}

interface CotacaoResposta {
  id: string;
  cotacaoId: string;
  fornecedor: {
    id: string;
    nome: string;
    empresa: string;
  };
  proposta: string;
  valor: string;
  prazoEntrega: string;
  dataResposta: string;
}

export const QuotesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cotacoes, setCotacoes] = useState<Cotacao[]>([]);
  const [novaCotacao, setNovaCotacao] = useState({
    titulo: "",
    descricao: "",
    setor: "",
    orcamento: "",
    prazo: ""
  });

  useEffect(() => {
    const cotacoesSalvas = localStorage.getItem("cotacoes");
    if (cotacoesSalvas) {
      setCotacoes(JSON.parse(cotacoesSalvas));
    }
  }, []);

  const handleCriarCotacao = () => {
    if (!novaCotacao.titulo || !novaCotacao.descricao || !novaCotacao.setor) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const cotacao: Cotacao = {
      id: uuidv4(),
      ...novaCotacao,
      status: 'aberta',
      solicitante: {
        id: user?.id || '',
        nome: user?.nomeResponsavel || '',
        empresa: user?.nomeEmpresa || ''
      },
      respostas: [],
      dataCriacao: new Date().toISOString()
    };

    const cotacoesAtualizadas = [...cotacoes, cotacao];
    setCotacoes(cotacoesAtualizadas);
    localStorage.setItem("cotacoes", JSON.stringify(cotacoesAtualizadas));

    setNovaCotacao({
      titulo: "",
      descricao: "",
      setor: "",
      orcamento: "",
      prazo: ""
    });

    toast({
      title: "Cotação criada",
      description: "Sua solicitação de cotação foi publicada"
    });
  };

  const cotacaoesAbertas = cotacoes.filter(c => c.status === 'aberta');
  const minhasCotacoes = cotacoes.filter(c => c.solicitante.id === user?.id);

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link to="/dashboard">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Dashboard
            </Button>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sistema de Cotações
          </h1>
          <p className="text-gray-600">
            Solicite e responda cotações por setor
          </p>
        </div>

        <Tabs defaultValue="abertas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="abertas">Cotações Abertas</TabsTrigger>
            <TabsTrigger value="minhas">Minhas Solicitações</TabsTrigger>
            <TabsTrigger value="criar">Nova Cotação</TabsTrigger>
          </TabsList>

          <TabsContent value="abertas">
            <div className="grid gap-6">
              {cotacaoesAbertas.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Nenhuma cotação aberta no momento</p>
                  </CardContent>
                </Card>
              ) : (
                cotacaoesAbertas.map((cotacao) => (
                  <Card key={cotacao.id} className="gradient-card">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{cotacao.titulo}</CardTitle>
                          <CardDescription>
                            {cotacao.solicitante.empresa} • {cotacao.setor}
                          </CardDescription>
                        </div>
                        <Badge variant="outline">
                          {cotacao.status === 'aberta' ? 'Aberta' : 'Fechada'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{cotacao.descricao}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Orçamento:</span>
                          <p className="font-medium">{cotacao.orcamento || 'Não informado'}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Prazo:</span>
                          <p className="font-medium">{cotacao.prazo || 'Não informado'}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-4 pt-4 border-t">
                        <span className="text-sm text-gray-500">
                          {cotacao.respostas.length} resposta(s)
                        </span>
                        <Button size="sm">
                          Responder Cotação
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="minhas">
            <div className="grid gap-6">
              {minhasCotacoes.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Você ainda não criou nenhuma cotação</p>
                  </CardContent>
                </Card>
              ) : (
                minhasCotacoes.map((cotacao) => (
                  <Card key={cotacao.id} className="gradient-card">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{cotacao.titulo}</CardTitle>
                          <CardDescription>{cotacao.setor}</CardDescription>
                        </div>
                        <Badge variant="outline">
                          {cotacao.respostas.length} resposta(s)
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{cotacao.descricao}</p>
                      <div className="text-sm text-gray-500">
                        Criado em {new Date(cotacao.dataCriacao).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="criar">
            <Card className="gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Nova Solicitação de Cotação
                </CardTitle>
                <CardDescription>
                  Descreva o que você precisa e receba propostas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="titulo">Título da Cotação *</Label>
                  <Input
                    id="titulo"
                    value={novaCotacao.titulo}
                    onChange={(e) => setNovaCotacao({...novaCotacao, titulo: e.target.value})}
                    placeholder="Ex: Criação de site institucional"
                  />
                </div>

                <div>
                  <Label htmlFor="setor">Setor *</Label>
                  <Input
                    id="setor"
                    value={novaCotacao.setor}
                    onChange={(e) => setNovaCotacao({...novaCotacao, setor: e.target.value})}
                    placeholder="Ex: Tecnologia, Marketing, Consultoria"
                  />
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição Detalhada *</Label>
                  <Textarea
                    id="descricao"
                    value={novaCotacao.descricao}
                    onChange={(e) => setNovaCotacao({...novaCotacao, descricao: e.target.value})}
                    placeholder="Descreva detalhadamente o que você precisa..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="orcamento">Orçamento Estimado</Label>
                    <Input
                      id="orcamento"
                      value={novaCotacao.orcamento}
                      onChange={(e) => setNovaCotacao({...novaCotacao, orcamento: e.target.value})}
                      placeholder="Ex: R$ 5.000 - R$ 10.000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="prazo">Prazo Desejado</Label>
                    <Input
                      id="prazo"
                      value={novaCotacao.prazo}
                      onChange={(e) => setNovaCotacao({...novaCotacao, prazo: e.target.value})}
                      placeholder="Ex: 30 dias"
                    />
                  </div>
                </div>

                <Button onClick={handleCriarCotacao} className="w-full gradient-primary text-white">
                  Publicar Cotação
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
