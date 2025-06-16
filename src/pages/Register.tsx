
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nomeEmpresa: "",
    cnpj: "",
    areaAtuacao: "",
    tipoEstabelecimento: "",
    regiao: "",
    descricao: "",
    parceriasDesejadas: ""
  });

  const setoresEconomicos = [
    "Agronegócio",
    "Alimentação e Bebidas",
    "Automotivo",
    "Aviação",
    "Banco e Finanças",
    "Biotecnologia",
    "Comunicação e Marketing",
    "Construção Civil",
    "Consultoria",
    "Cosmética e Beleza",
    "E-commerce",
    "Educação",
    "Energia",
    "Entretenimento",
    "Farmacêutico",
    "Imobiliário",
    "Indústria Química",
    "Logística e Transporte",
    "Moda e Têxtil",
    "Petróleo e Gás",
    "Saúde",
    "Segurança",
    "Serviços Financeiros",
    "Tecnologia da Informação",
    "Telecomunicações",
    "Turismo e Hotelaria",
    "Varejo",
    "Mecânica Automotiva",
    "Agência de Viagens",
    "Serviços Jurídicos"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Salvar dados no localStorage (simulando banco de dados)
    const empresas = JSON.parse(localStorage.getItem("empresas") || "[]");
    const novaEmpresa = {
      ...formData,
      id: Date.now(),
      dataCadastro: new Date().toISOString()
    };
    empresas.push(novaEmpresa);
    localStorage.setItem("empresas", JSON.stringify(empresas));
    localStorage.setItem("empresaAtual", JSON.stringify(novaEmpresa));

    toast({
      title: "Empresa cadastrada com sucesso!",
      description: "Redirecionando para o dashboard..."
    });

    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectAreaChange = (value: string) => {
    setFormData({
      ...formData,
      areaAtuacao: value
    });
  };

  const handleSelectParceriaChange = (value: string) => {
    setFormData({
      ...formData,
      parceriasDesejadas: value
    });
  };

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
            <Link to="/dashboard">
              <Button variant="outline">Ir para Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Cadastro de Empresa</CardTitle>
              <CardDescription>
                Preencha os dados da sua empresa para começar a encontrar parceiros
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nomeEmpresa">Nome da Empresa *</Label>
                    <Input 
                      id="nomeEmpresa"
                      name="nomeEmpresa"
                      value={formData.nomeEmpresa}
                      onChange={handleChange}
                      required
                      placeholder="Ex: Inovação Tech Ltda"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cnpj">CNPJ *</Label>
                    <Input 
                      id="cnpj"
                      name="cnpj"
                      value={formData.cnpj}
                      onChange={handleChange}
                      required
                      placeholder="00.000.000/0001-00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="areaAtuacao">Área de Atuação *</Label>
                    <Select value={formData.areaAtuacao} onValueChange={handleSelectAreaChange} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a área de atuação" />
                      </SelectTrigger>
                      <SelectContent>
                        {setoresEconomicos.map((setor) => (
                          <SelectItem key={setor} value={setor}>
                            {setor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="tipoEstabelecimento">Tipo de Estabelecimento *</Label>
                    <Input 
                      id="tipoEstabelecimento"
                      name="tipoEstabelecimento"
                      value={formData.tipoEstabelecimento}
                      onChange={handleChange}
                      required
                      placeholder="Ex: Matriz, Filial, Franquia"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="regiao">Região de Interesse *</Label>
                  <Input 
                    id="regiao"
                    name="regiao"
                    value={formData.regiao}
                    onChange={handleChange}
                    required
                    placeholder="Ex: São Paulo, Rio de Janeiro, Nacional"
                  />
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição da Empresa</Label>
                  <Textarea 
                    id="descricao"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    placeholder="Conte um pouco sobre sua empresa, produtos e serviços..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="parceriasDesejadas">Setor de Parceria Desejada *</Label>
                  <Select value={formData.parceriasDesejadas} onValueChange={handleSelectParceriaChange} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o setor de interesse para parcerias" />
                    </SelectTrigger>
                    <SelectContent>
                      {setoresEconomicos.map((setor) => (
                        <SelectItem key={setor} value={setor}>
                          {setor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Cadastrar Empresa
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
