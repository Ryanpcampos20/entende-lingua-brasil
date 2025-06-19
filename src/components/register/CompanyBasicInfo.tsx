
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CompanyBasicInfoProps {
  formData: {
    nomeEmpresa: string;
    cnpj: string;
    nomeResponsavel: string;
    email: string;
    telefone: string;
    senha: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  passwordErrors?: string[];
}

export const CompanyBasicInfo = ({ formData, onChange, passwordErrors }: CompanyBasicInfoProps) => {
  return (
    <div className="space-y-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nomeResponsavel">Nome do Responsável *</Label>
          <Input 
            id="nomeResponsavel"
            name="nomeResponsavel"
            value={formData.nomeResponsavel}
            onChange={onChange}
            required
            placeholder="Nome completo do responsável"
          />
        </div>
        <div>
          <Label htmlFor="email">E-mail *</Label>
          <Input 
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={onChange}
            required
            placeholder="email@empresa.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="telefone">Telefone *</Label>
          <Input 
            id="telefone"
            name="telefone"
            value={formData.telefone}
            onChange={onChange}
            required
            placeholder="(11) 99999-9999"
          />
        </div>
        <div>
          <Label htmlFor="senha">Senha *</Label>
          <Input 
            id="senha"
            name="senha"
            type="password"
            value={formData.senha}
            onChange={onChange}
            required
            placeholder="Mínimo 8 caracteres, 1 maiúscula, 1 número"
          />
          {passwordErrors && passwordErrors.length > 0 && (
            <div className="mt-1 text-sm text-red-600">
              {passwordErrors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
