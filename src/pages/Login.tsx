
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterHeader } from "@/components/register/RegisterHeader";

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <RegisterHeader />
      
      <div className="py-12 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
