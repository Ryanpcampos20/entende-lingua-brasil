
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { setoresEconomicos } from "@/utils/sectorsData";

interface CompanyDescriptionProps {
  formData: {
    descricao: string;
    areaAtuacao: string[];
    parceriasDesejadas: string[];
  };
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onArrayChange: (field: string, value: string[]) => void;
}

export const CompanyDescription = ({ formData, onChange, onArrayChange }: CompanyDescriptionProps) => {
  const [selectedAreaAtuacao, setSelectedAreaAtuacao] = useState("");
  const [selectedParceria, setSelectedParceria] = useState("");

  const addAreaAtuacao = () => {
    if (selectedAreaAtuacao && !formData.areaAtuacao.includes(selectedAreaAtuacao)) {
      onArrayChange("areaAtuacao", [...formData.areaAtuacao, selectedAreaAtuacao]);
      setSelectedAreaAtuacao("");
    }
  };

  const removeAreaAtuacao = (area: string) => {
    onArrayChange("areaAtuacao", formData.areaAtuacao.filter(a => a !== area));
  };

  const addParceria = () => {
    if (selectedParceria && !formData.parceriasDesejadas.includes(selectedParceria)) {
      onArrayChange("parceriasDesejadas", [...formData.parceriasDesejadas, selectedParceria]);
      setSelectedParceria("");
    }
  };

  const removeParceria = (parceria: string) => {
    onArrayChange("parceriasDesejadas", formData.parceriasDesejadas.filter(p => p !== parceria));
  };

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
        <Label>Áreas de Atuação *</Label>
        <div className="flex gap-2 mb-2">
          <Select value={selectedAreaAtuacao} onValueChange={setSelectedAreaAtuacao}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Selecione uma área de atuação" />
            </SelectTrigger>
            <SelectContent>
              {setoresEconomicos.map((setor) => (
                <SelectItem key={setor} value={setor}>
                  {setor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" onClick={addAreaAtuacao} variant="outline">
            Adicionar
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.areaAtuacao.map((area) => (
            <Badge key={area} variant="secondary" className="flex items-center gap-1">
              {area}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeAreaAtuacao(area)} />
            </Badge>
          ))}
        </div>
        {formData.areaAtuacao.length === 0 && (
          <p className="text-sm text-red-600">Adicione pelo menos uma área de atuação</p>
        )}
      </div>

      <div>
        <Label>Setores de Parceria Desejada *</Label>
        <div className="flex gap-2 mb-2">
          <Select value={selectedParceria} onValueChange={setSelectedParceria}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Selecione um setor de interesse para parcerias" />
            </SelectTrigger>
            <SelectContent>
              {setoresEconomicos.map((setor) => (
                <SelectItem key={setor} value={setor}>
                  {setor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" onClick={addParceria} variant="outline">
            Adicionar
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.parceriasDesejadas.map((parceria) => (
            <Badge key={parceria} variant="secondary" className="flex items-center gap-1">
              {parceria}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeParceria(parceria)} />
            </Badge>
          ))}
        </div>
        {formData.parceriasDesejadas.length === 0 && (
          <p className="text-sm text-red-600">Adicione pelo menos um setor de parceria desejada</p>
        )}
      </div>
    </>
  );
};
