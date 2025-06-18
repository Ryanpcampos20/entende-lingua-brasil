
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CompanyBasicInfo } from "./CompanyBasicInfo";
import { CompanyDetails } from "./CompanyDetails";
import { CompanyDescription } from "./CompanyDescription";

interface RegisterFormProps {
  onSubmit: (formData: any) => void;
}

export const RegisterForm = ({ onSubmit }: RegisterFormProps) => {
  const [formData, setFormData] = useState({
    nomeEmpresa: "",
    cnpj: "",
    areaAtuacao: "",
    tipoEstabelecimento: "",
    regiao: "",
    descricao: "",
    parceriasDesejadas: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (field: string, value: string) => {
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
      />
      
      <CompanyDetails 
        formData={formData}
        onSelectChange={handleSelectChange}
        onChange={handleChange}
      />
      
      <CompanyDescription 
        formData={formData}
        onChange={handleChange}
        onSelectChange={handleSelectChange}
      />

      <Button type="submit" className="w-full" size="lg">
        Cadastrar Empresa
      </Button>
    </form>
  );
};
