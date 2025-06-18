
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CompanyBasicInfoProps {
  formData: {
    nomeEmpresa: string;
    cnpj: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CompanyBasicInfo = ({ formData, onChange }: CompanyBasicInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="nomeEmpresa">Nome da Empresa *</Label>
        <Input 
          id="nomeEmpresa"
          name="nomeEmpresa"
          value={formData.nomeEmpresa}
          onChange={onChange}
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
          onChange={onChange}
          required
          placeholder="00.000.000/0001-00"
        />
      </div>
    </div>
  );
};
