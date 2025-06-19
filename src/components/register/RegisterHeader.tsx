
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const RegisterHeader = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/6e4f1017-6bad-4cc1-a450-27f5919b2498.png" 
              alt="Connected Partners & Business Logo" 
              className="h-16 w-16 object-contain drop-shadow-lg filter brightness-110 contrast-125"
            />
            <h1 className="text-2xl font-bold text-gray-900">
              Connected Partners & Business
            </h1>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline">Ir para Dashboard</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
