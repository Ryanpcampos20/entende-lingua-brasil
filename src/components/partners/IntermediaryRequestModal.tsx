
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { HandHeart, Send } from "lucide-react";

interface IntermediaryRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  companyId: string;
}

export const IntermediaryRequestModal: React.FC<IntermediaryRequestModalProps> = ({
  isOpen,
  onClose,
  companyName,
  companyId
}) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast({
        title: "Mensagem obrigatória",
        description: "Por favor, descreva como podemos ajudar com esta parceria.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Simular envio da solicitação
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Solicitação enviada!",
        description: `Sua solicitação de intermediação com ${companyName} foi enviada. Nossa equipe entrará em contato em até 24 horas.`,
      });
      
      setMessage("");
      onClose();
    } catch (error) {
      toast({
        title: "Erro ao enviar solicitação",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <HandHeart className="h-5 w-5" />
            Solicitar Intermediação
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">
              Connected Partners & Business
            </h4>
            <p className="text-sm text-blue-800">
              Nossos especialistas irão facilitar o contato e negociação com{" "}
              <strong>{companyName}</strong> para maximizar as chances de uma parceria bem-sucedida.
            </p>
          </div>

          <div>
            <Label htmlFor="message">
              Descreva como podemos ajudar com esta parceria: *
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ex: Gostaria de uma apresentação formal, negociar termos de parceria, alinhar expectativas..."
              rows={4}
              className="mt-1"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 gradient-primary text-white"
              disabled={loading}
            >
              {loading ? (
                "Enviando..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Solicitar
                </>
              )}
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            * Taxa de intermediação aplicável apenas em caso de parceria concretizada
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
