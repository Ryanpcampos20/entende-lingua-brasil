
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { setoresEconomicos } from "@/utils/sectorsData";

interface CompanyDetailsProps {
  formData: {
    areaAtuacao: string;
    tipoEstabelecimento: string;
    regiao: string;
  };
  onSelectChange: (field: string, value: string) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CompanyDetails = ({ formData, onSelectChange, onChange }: CompanyDetailsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="areaAtuacao">Área de Atuação *</Label>
          <Select 
            value={formData.areaAtuacao} 
            onValueChange={(value) => onSelectChange("areaAtuacao", value)} 
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a área de atuação" />
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
