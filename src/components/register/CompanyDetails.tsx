
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { setoresEconomicos } from "@/utils/sectorsData";

interface CompanyDetailsProps {
  formData: {
    areaAtuacao: string[];
    tipoEstabelecimento: string;
    regiao: string;
  };
  onSelectChange: (field: string, value: string) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CompanyDetails = ({ formData, onSelectChange, onChange }: CompanyDetailsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="tipoEstabelecimento">Tipo de Estabelecimento *</Label>
        <Input 
          id="tipoEstabelecimento"
          name="tipoEstabelecimento"
          value={formData.tipoEstabelecimento}
          onChange={onChange}
          required
          placeholder="Ex: Matriz, Filial, Franquia"
        />
      </div>

      <div>
        <Label htmlFor="regiao">Região de Interesse *</Label>
        <Input 
          id="regiao"
          name="regiao"
          value={formData.regiao}
          onChange={onChange}
          required
          placeholder="Ex: São Paulo, Rio de Janeiro, Nacional"
        />
      </div>
    </>
  );
};
