
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CompanyBasicInfo } from "./CompanyBasicInfo";
import { CompanyDetails } from "./CompanyDetails";
import { CompanyDescription } from "./CompanyDescription";
import { validatePassword } from "@/utils/passwordValidation";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface RegisterFormProps {
  onSubmit?: (formData: any) => void;
}

export const RegisterForm = ({ onSubmit }: RegisterFormProps) => {
  const [formData, setFormData] = useState({
    nomeEmpresa: "",
    cnpj: "",
    nomeResponsavel: "",
    email: "",
    telefone: "",
    senha: "",
    areaAtuacao: [],
    tipoEstabelecimento: "",
    regiao: "",
    descricao: "",
    parceriasDesejadas: []
  });

  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { signUp } = useSupabaseAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar senha
    const passwordValidation = validatePassword(formData.senha);
    if (!passwordValidation.isValid) {
      setPasswordErrors(passwordValidation.errors);
      return;
    }

    // Validar se há pelo menos uma área de atuação e parceria desejada
    if (formData.areaAtuacao.length === 0) {
      toast({
        title: "Erro no cadastro",
        description: "Adicione pelo menos uma área de atuação",
        variant: "destructive"
      });
      return;
    }

    if (formData.parceriasDesejadas.length === 0) {
      toast({
        title: "Erro no cadastro", 
        description: "Adicione pelo menos um setor de parceria desejada",
        variant: "destructive"
      });
      return;
    }

    setPasswordErrors([]);
    setLoading(true);

    // Preparar dados para o Supabase
    const userData = {
      nome_empresa: formData.nomeEmpresa,
      cnpj: formData.cnpj,
      nome_responsavel: formData.nomeResponsavel,
      telefone: formData.telefone,
      area_atuacao: formData.areaAtuacao.join(', '),
      tipo_estabelecimento: formData.tipoEstabelecimento,
      regiao: formData.regiao,
      descricao: formData.descricao,
      parcerias_desejadas: formData.parceriasDesejadas.join(', ')
    };

    const { error } = await signUp(formData.email, formData.senha, userData);

    if (error) {
      toast({
        title: "Erro no cadastro",
        description: error.message || "Erro ao criar conta",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Conta criada com sucesso!",
      description: "Verifique seu e-mail para confirmar a conta e depois faça login."
    });

    setTimeout(() => {
      navigate("/login");
    }, 2000);

    if (onSubmit) {
      onSubmit(formData);
    }
    
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    // Limpar erros de senha quando o usuário começar a digitar
    if (e.target.name === 'senha') {
      setPasswordErrors([]);
    }
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleArrayChange = (field: string, value: string[]) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CompanyBasicInfo 
        formData={formData}
        onChange={handleChange}
        passwordErrors={passwordErrors}
      />
      
      <CompanyDetails 
        formData={formData}
        onSelectChange={handleSelectChange}
        onChange={handleChange}
      />
      
      <CompanyDescription 
        formData={formData}
        onChange={handleChange}
        onArrayChange={handleArrayChange}
      />

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? "Cadastrando..." : "Cadastrar Empresa"}
      </Button>
    </form>
  );
};
