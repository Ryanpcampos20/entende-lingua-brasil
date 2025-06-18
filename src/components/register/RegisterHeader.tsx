
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const RegisterHeader = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/bad5c8be-c34c-4862-b6b3-b7ad10c24b65.png" 
              alt="Connected Partners & Business Logo" 
              className="h-8 w-8 object-contain"
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
