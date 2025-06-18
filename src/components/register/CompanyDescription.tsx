
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { setoresEconomicos } from "@/utils/sectorsData";

interface CompanyDescriptionProps {
  formData: {
    descricao: string;
    parceriasDesejadas: string;
  };
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSelectChange: (field: string, value: string) => void;
}

export const CompanyDescription = ({ formData, onChange, onSelectChange }: CompanyDescriptionProps) => {
  return (
    <>
      <div>
        <Label htmlFor="descricao">Descrição da Empresa</Label>
        <Textarea 
          id="descricao"
          name="descricao"
          value={formData.descricao}
          onChange={onChange}
          placeholder="Conte um pouco sobre sua empresa, produtos e serviços..."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="parceriasDesejadas">Setor de Parceria Desejada *</Label>
        <Select 
          value={formData.parceriasDesejadas} 
          onValueChange={(value) => onSelectChange("parceriasDesejadas", value)} 
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o setor de interesse para parcerias" />
          </SelectTrigger>
          <SelectContent>
            {setoresEconomicos.map((setor) => (
              <SelectItem key={setor} value={setor}>
                {setor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
