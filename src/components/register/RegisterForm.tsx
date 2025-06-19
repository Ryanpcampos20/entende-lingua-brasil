
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CompanyBasicInfo } from "./CompanyBasicInfo";
import { CompanyDetails } from "./CompanyDetails";
import { CompanyDescription } from "./CompanyDescription";
import { validatePassword } from "@/utils/passwordValidation";

interface RegisterFormProps {
  onSubmit: (formData: any) => void;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar senha
    const passwordValidation = validatePassword(formData.senha);
    if (!passwordValidation.isValid) {
      setPasswordErrors(passwordValidation.errors);
      return;
    }

    // Validar se há pelo menos uma área de atuação e parceria desejada
    if (formData.areaAtuacao.length === 0) {
      alert("Adicione pelo menos uma área de atuação");
      return;
    }

    if (formData.parceriasDesejadas.length === 0) {
      alert("Adicione pelo menos um setor de parceria desejada");
      return;
    }

    setPasswordErrors([]);
    onSubmit(formData);
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

      <Button type="submit" className="w-full" size="lg">
        Cadastrar Empresa
      </Button>
    </form>
  );
};
