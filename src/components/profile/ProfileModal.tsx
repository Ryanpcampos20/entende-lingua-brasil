
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building, Phone, Mail, Calendar, Target } from "lucide-react";

interface Profile {
  id: string;
  nome_empresa: string;
  cnpj: string;
  nome_responsavel: string;
  email: string;
  telefone?: string;
  area_atuacao: string;
  tipo_estabelecimento: string;
  regiao: string;
  descricao?: string;
  parcerias_desejadas: string;
  data_cadastro?: string;
}

interface ProfileModalProps {
  profile: Profile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  isOpen,
  onClose
}) => {
  if (!profile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            {profile.nome_empresa}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Informações da Empresa</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  <span>{profile.nome_empresa}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">CNPJ:</span>
                  <span>{profile.cnpj}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Responsável:</span>
                  <span>{profile.nome_responsavel}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Contato</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{profile.email}</span>
                </div>
                {profile.telefone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{profile.telefone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{profile.regiao}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Área de Atuação e Tipo */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Atividade Empresarial</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="default" className="bg-primary text-white">
                {profile.area_atuacao}
              </Badge>
              <Badge variant="outline">
                {profile.tipo_estabelecimento}
              </Badge>
            </div>
          </div>

          {/* Parcerias Desejadas */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Parcerias Desejadas
            </h3>
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              {profile.parcerias_desejadas}
            </Badge>
          </div>

          {/* Descrição */}
          {profile.descricao && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Sobre a Empresa</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {profile.descricao}
              </p>
            </div>
          )}

          {/* Data de Cadastro */}
          {profile.data_cadastro && (
            <div className="flex items-center gap-2 text-sm text-gray-500 pt-4 border-t">
              <Calendar className="h-4 w-4" />
              <span>
                Cadastrado em {new Date(profile.data_cadastro).toLocaleDateString('pt-BR')}
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
