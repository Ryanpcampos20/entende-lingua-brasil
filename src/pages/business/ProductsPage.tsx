
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, ShoppingBag, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  empresaId: number;
  dataCriacao: string;
}

const ProductsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Produto | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: "",
    categoria: ""
  });

  const categorias = [
    "Agronegócio", "Alimentação e Bebidas", "Automotivo", "Aviação",
    "Banco e Finanças", "Biotecnologia", "Comunicação e Marketing",
    "Construção Civil", "Consultoria", "Cosmética e Beleza", "E-commerce",
    "Educação", "Energia", "Entretenimento", "Farmacêutico", "Imobiliário",
    "Indústria Química", "Logística e Transporte", "Moda e Têxtil",
    "Petróleo e Gás", "Saúde", "Segurança", "Serviços Financeiros",
    "Tecnologia da Informação", "Telecomunicações", "Turismo e Hotelaria",
    "Varejo", "Mecânica Automotiva", "Agência de Viagens", "Serviços Jurídicos"
  ];

  useEffect(() => {
    carregarProdutos();
  }, [user]);

  const carregarProdutos = () => {
    const produtosData = localStorage.getItem("produtos");
    if (produtosData && user) {
      const todosProdutos: Produto[] = JSON.parse(produtosData);
      const produtosEmpresa = todosProdutos.filter(p => p.empresaId === user.id);
      setProdutos(produtosEmpresa);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const produto: Produto = {
      id: editingProduct ? editingProduct.id : Date.now(),
      nome: formData.nome,
      descricao: formData.descricao,
      preco: parseFloat(formData.preco),
      categoria: formData.categoria,
      empresaId: user!.id,
      dataCriacao: editingProduct ? editingProduct.dataCriacao : new Date().toISOString()
    };

    const produtosData = localStorage.getItem("produtos");
    let todosProdutos: Produto[] = produtosData ? JSON.parse(produtosData) : [];

    if (editingProduct) {
      todosProdutos = todosProdutos.map(p => p.id === editingProduct.id ? produto : p);
      toast({
        title: "Produto atualizado!",
        description: "As informações do produto foram atualizadas com sucesso."
      });
    } else {
      todosProdutos.push(produto);
      toast({
        title: "Produto cadastrado!",
        description: "Seu produto foi adicionado à vitrine com sucesso."
      });
    }

    localStorage.setItem("produtos", JSON.stringify(todosProdutos));
    carregarProdutos();
    setIsDialogOpen(false);
    setEditingProduct(null);
    setFormData({ nome: "", descricao: "", preco: "", categoria: "" });
  };

  const handleEdit = (produto: Produto) => {
    setEditingProduct(produto);
    setFormData({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco.toString(),
      categoria: produto.categoria
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    const produtosData = localStorage.getItem("produtos");
    if (produtosData) {
      let todosProdutos: Produto[] = JSON.parse(produtosData);
      todosProdutos = todosProdutos.filter(p => p.id !== id);
      localStorage.setItem("produtos", JSON.stringify(todosProdutos));
      carregarProdutos();
      toast({
        title: "Produto removido!",
        description: "O produto foi removido da sua vitrine."
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      categoria: value
    });
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link to="/dashboard" className="mr-4">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <img 
                  src="/lovable-uploads/e8102e8e-a33f-4a70-84ed-a1efec461924.png" 
                  alt="Connected Partners & Business Logo" 
                  className="h-8 w-8 object-contain"
                />
                <h1 className="text-xl font-bold text-gray-900">
                  Meus Produtos/Serviços
                </h1>
              </div>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Produto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? "Editar Produto" : "Novo Produto/Serviço"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingProduct ? "Atualize as informações do produto" : "Adicione um novo produto ou serviço à sua vitrine"}
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="nome">Nome do Produto/Serviço *</Label>
                    <Input 
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      required
                      placeholder="Ex: Consultoria em TI"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="categoria">Categoria *</Label>
                    <Select value={formData.categoria} onValueChange={handleSelectChange} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map((categoria) => (
                          <SelectItem key={categoria} value={categoria}>
                            {categoria}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="preco">Preço (R$) *</Label>
                    <Input 
                      id="preco"
                      name="preco"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.preco}
                      onChange={handleChange}
                      required
                      placeholder="0,00"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea 
                      id="descricao"
                      name="descricao"
                      value={formData.descricao}
                      onChange={handleChange}
                      placeholder="Descreva seu produto ou serviço..."
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="w-full gradient-primary text-white">
                    {editingProduct ? "Atualizar Produto" : "Cadastrar Produto"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Company Info */}
        <Card className="gradient-card mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold text-primary">{user?.nomeEmpresa}</h3>
            <p className="text-sm text-gray-600">
              Vitrine de produtos e serviços | Total: {produtos.length} itens
            </p>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtos.length === 0 ? (
            <div className="col-span-full">
              <Card className="gradient-card">
                <CardContent className="p-8 text-center">
                  <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhum produto cadastrado
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Comece adicionando seus produtos ou serviços à vitrine
                  </p>
                  <Button
                    onClick={() => setIsDialogOpen(true)}
                    className="gradient-primary text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Primeiro Produto
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            produtos.map((produto) => (
              <Card key={produto.id} className="gradient-card hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-primary text-lg">
                        {produto.nome}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {produto.categoria}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(produto)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(produto.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-primary">
                      R$ {produto.preco.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                  
                  {produto.descricao && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {produto.descricao}
                    </p>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    Criado em: {new Date(produto.dataCriacao).toLocaleDateString('pt-BR')}
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

export default ProductsPage;
