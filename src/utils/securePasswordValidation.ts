
export interface PasswordValidation {
  isValid: boolean;
  score: number;
  errors: string[];
  suggestions: string[];
}

export const validatePassword = (password: string): PasswordValidation => {
  const errors: string[] = [];
  const suggestions: string[] = [];
  let score = 0;

  // Minimum length check (12 characters)
  if (password.length < 12) {
    errors.push("A senha deve ter pelo menos 12 caracteres");
    suggestions.push("Use uma senha mais longa para maior segurança");
  } else {
    score += 20;
  }

  // Uppercase letter check
  if (!/[A-Z]/.test(password)) {
    errors.push("A senha deve conter pelo menos uma letra maiúscula");
    suggestions.push("Adicione letras maiúsculas à sua senha");
  } else {
    score += 15;
  }

  // Lowercase letter check
  if (!/[a-z]/.test(password)) {
    errors.push("A senha deve conter pelo menos uma letra minúscula");
    suggestions.push("Adicione letras minúsculas à sua senha");
  } else {
    score += 15;
  }

  // Number check
  if (!/\d/.test(password)) {
    errors.push("A senha deve conter pelo menos um número");
    suggestions.push("Adicione números à sua senha");
  } else {
    score += 15;
  }

  // Special character check
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("A senha deve conter pelo menos um caractere especial (!@#$%^&*()_+-=[]{}|;':\",./<>?)");
    suggestions.push("Adicione caracteres especiais para maior segurança");
  } else {
    score += 20;
  }

  // Additional complexity checks
  if (password.length >= 16) {
    score += 10;
  }

  // Check for common patterns
  const commonPatterns = [
    /123456/,
    /password/i,
    /qwerty/i,
    /admin/i,
    /login/i
  ];

  const hasCommonPattern = commonPatterns.some(pattern => pattern.test(password));
  if (hasCommonPattern) {
    errors.push("A senha contém padrões comuns que são fáceis de adivinhar");
    suggestions.push("Evite sequências e palavras comuns");
    score -= 15;
  }

  // Character variety bonus
  const uniqueChars = new Set(password).size;
  if (uniqueChars >= password.length * 0.7) {
    score += 5;
  }

  return {
    isValid: errors.length === 0 && score >= 70,
    score: Math.max(0, Math.min(100, score)),
    errors,
    suggestions
  };
};

export const getPasswordStrengthText = (score: number): { text: string; color: string } => {
  if (score < 30) return { text: "Muito Fraca", color: "text-red-600" };
  if (score < 50) return { text: "Fraca", color: "text-orange-600" };
  if (score < 70) return { text: "Moderada", color: "text-yellow-600" };
  if (score < 85) return { text: "Forte", color: "text-green-600" };
  return { text: "Muito Forte", color: "text-green-700" };
};
