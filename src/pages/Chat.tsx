
import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatSystem } from "@/components/chat/ChatSystem";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft } from "lucide-react";

const Chat = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [receiverInfo, setReceiverInfo] = useState<{ id: string; name: string } | null>(null);

  const receiverId = searchParams.get('with');

  useEffect(() => {
    if (receiverId) {
      // Buscar informações da empresa receptora
      const empresas = JSON.parse(localStorage.getItem("empresas") || "[]");
      const receiver = empresas.find((emp: any) => emp.id === receiverId);
      
      if (receiver) {
        setReceiverInfo({
          id: receiver.id,
          name: receiver.nomeEmpresa
        });
      }
    }
  }, [receiverId]);

  if (!user) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>Você precisa estar logado para acessar o chat</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!receiverId || !receiverInfo) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Chat não encontrado</CardTitle>
            <CardDescription>Empresa não encontrada para iniciar o chat</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/partners">
              <Button>Voltar para Parceiros</Button>
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
          <Link to="/partners">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Parceiros
            </Button>
          </Link>
        </div>

        <ChatSystem 
          receiverId={receiverInfo.id}
          receiverName={receiverInfo.name}
        />
      </div>
    </div>
  );
};

export default Chat;
