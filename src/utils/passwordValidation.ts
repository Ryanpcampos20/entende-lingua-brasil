
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push("A senha deve ter pelo menos 8 caracteres");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("A senha deve conter pelo menos uma letra maiúscula");
  }
  
  if (!/\d/.test(password)) {
    errors.push("A senha deve conter pelo menos um número");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
