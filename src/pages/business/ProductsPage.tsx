import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { v4 as uuidv4 } from 'uuid';

interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: string;
  categoria: string;
}

export const ProductsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    descricao: "",
    preco: "",
    categoria: ""
  });

  useEffect(() => {
    // Carregar produtos do localStorage ao montar o componente
    const produtosSalvos = localStorage.getItem(`produtos-${user?.id}`);
    if (produtosSalvos) {
      setProdutos(JSON.parse(produtosSalvos));
    }
  }, [user?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNovoProduto(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAdicionarProduto = () => {
    if (!novoProduto.nome || !novoProduto.descricao || !novoProduto.preco || !novoProduto.categoria) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    const novoProdutoComId: Produto = {
      ...novoProduto,
      id: uuidv4()
    };

    const produtosAtualizados = [...produtos, novoProdutoComId];
    setProdutos(produtosAtualizados);
    localStorage.setItem(`produtos-${user?.id}`, JSON.stringify(produtosAtualizados));

    setNovoProduto({
      nome: "",
      descricao: "",
      preco: "",
      categoria: ""
    });

    toast({
      title: "Produto adicionado",
      description: "O produto foi adicionado com sucesso."
    });
  };

  const handleRemoverProduto = (id: string) => {
    const produtosAtualizados = produtos.filter(produto => produto.id !== id);
    setProdutos(produtosAtualizados);
    
    localStorage.setItem(`produtos-${user?.id}`, JSON.stringify(produtosAtualizados));
    
    toast({
      title: "Produto removido",
      description: "O produto foi removido com sucesso."
    });
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Produtos da Empresa</CardTitle>
          <CardDescription>
            Gerencie os produtos da sua empresa aqui.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="nome">Nome do Produto</Label>
              <Input
                type="text"
                id="nome"
                name="nome"
                value={novoProduto.nome}
                onChange={handleInputChange}
                placeholder="Nome do produto"
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
              />
            </div>
            <div>
              <Label htmlFor="preco">Preço</Label>
              <Input
                type="number"
                id="preco"
                name="preco"
                value={novoProduto.preco}
                onChange={handleInputChange}
                placeholder="Preço do produto"
              />
            </div>
            <div>
              <Label htmlFor="categoria">Categoria</Label>
              <Input
                type="text"
                id="categoria"
                name="categoria"
                value={novoProduto.categoria}
                onChange={handleInputChange}
                placeholder="Categoria do produto"
              />
            </div>
            <Button onClick={handleAdicionarProduto}>Adicionar Produto</Button>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Lista de Produtos</h3>
            {produtos.length === 0 ? (
              <p>Nenhum produto cadastrado.</p>
            ) : (
              <div className="grid gap-4">
                {produtos.map(produto => (
                  <Card key={produto.id}>
                    <CardHeader>
                      <CardTitle>{produto.nome}</CardTitle>
                      <CardDescription>{produto.categoria}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Descrição: {produto.descricao}</p>
                      <p>Preço: {produto.preco}</p>
                      <Button variant="destructive" onClick={() => handleRemoverProduto(produto.id)}>Remover</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
