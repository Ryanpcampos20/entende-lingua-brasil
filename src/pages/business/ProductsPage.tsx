
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProducts } from "@/hooks/useProducts";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Link } from "react-router-dom";
import { ArrowLeft, Package, Plus } from "lucide-react";

export const ProductsPage = () => {
  const { user } = useSupabaseAuth();
  const { products, loading, addProduct, deleteProduct } = useProducts();
  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    descricao: "",
    preco: "",
    categoria: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNovoProduto(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAdicionarProduto = async () => {
    if (!novoProduto.nome.trim() || !novoProduto.categoria.trim()) {
      return;
    }

    const success = await addProduct({
      nome: novoProduto.nome.trim(),
      descricao: novoProduto.descricao.trim() || undefined,
      preco: novoProduto.preco ? parseFloat(novoProduto.preco) : undefined,
      categoria: novoProduto.categoria.trim() || undefined,
      disponivel: true
    });

    if (success) {
      setNovoProduto({
        nome: "",
        descricao: "",
        preco: "",
        categoria: ""
      });
    }
  };

  const handleRemoverProduto = async (id: string) => {
    await deleteProduct(id);
  };

  if (!user) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Você precisa estar logado para gerenciar produtos.</p>
            <Link to="/login">
              <Button className="mt-4">Fazer Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            Produtos da Empresa
          </h1>
          <p className="text-gray-600">
            Gerencie os produtos da sua empresa aqui.
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Adicionar Novo Produto
              </CardTitle>
              <CardDescription>
                Cadastre um novo produto ou serviço da sua empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome do Produto *</Label>
                <Input
                  type="text"
                  id="nome"
                  name="nome"
                  value={novoProduto.nome}
                  onChange={handleInputChange}
                  placeholder="Nome do produto"
                  required
                />
              </div>
              <div>
                <Label htmlFor="categoria">Categoria *</Label>
                <Input
                  type="text"
                  id="categoria"
                  name="categoria"
                  value={novoProduto.categoria}
                  onChange={handleInputChange}
                  placeholder="Categoria do produto"
                  required
                />
              </div>
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  name="descricao"
                  value={novoProduto.descricao}
                  onChange={handleInputChange}
                  placeholder="Descrição do produto"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="preco">Preço (R$)</Label>
                <Input
                  type="number"
                  id="preco"
                  name="preco"
                  value={novoProduto.preco}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <Button onClick={handleAdicionarProduto} className="w-full gradient-primary text-white">
                Adicionar Produto
              </Button>
            </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardHeader>
              <CardTitle>Lista de Produtos</CardTitle>
              <CardDescription>
                {products.length} produto(s) cadastrado(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">
                  <p>Carregando produtos...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhum produto cadastrado.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {products.map(produto => (
                    <Card key={produto.id} className="border border-gray-200">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{produto.nome}</CardTitle>
                            <CardDescription>{produto.categoria}</CardDescription>
                          </div>
                          {produto.preco && (
                            <div className="text-right">
                              <span className="text-lg font-semibold text-green-600">
                                R$ {produto.preco.toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {produto.descricao && (
                          <p className="text-gray-700 mb-4">{produto.descricao}</p>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            Cadastrado em {new Date(produto.created_at).toLocaleDateString()}
                          </span>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleRemoverProduto(produto.id)}
                          >
                            Remover
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
