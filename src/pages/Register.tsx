
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { RegisterForm } from "@/components/register/RegisterForm";
import { RegisterHeader } from "@/components/register/RegisterHeader";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleSubmit = (formData: any) => {
    // Salvar dados no localStorage (simulando banco de dados)
    const empresas = JSON.parse(localStorage.getItem("empresas") || "[]");
    const novaEmpresa = {
      ...formData,
      id: Date.now().toString(), // Convert to string to match User interface
      dataCadastro: new Date().toISOString()
    };
    empresas.push(novaEmpresa);
    localStorage.setItem("empresas", JSON.stringify(empresas));
    
    // Login automático após cadastro
    login(novaEmpresa);

    toast({
      title: "Empresa cadastrada com sucesso!",
      description: "Redirecionando para o dashboard..."
    });

    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <RegisterHeader />
      
      <div className="py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Cadastro de Empresa</CardTitle>
              <CardDescription>
                Preencha os dados da sua empresa para começar a encontrar parceiros
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RegisterForm onSubmit={handleSubmit} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
