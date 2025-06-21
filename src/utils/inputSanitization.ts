
/**
 * Sanitizes user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/\\/g, '&#x5C;')
    .replace(/&/g, '&amp;');
};

/**
 * Sanitizes HTML content while preserving basic formatting
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  
  // Remove script tags and their content
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove dangerous attributes
  html = html.replace(/\s*on\w+\s*=\s*['""][^'""]*['""]?/gi, '');
  html = html.replace(/\s*javascript\s*:/gi, '');
  html = html.replace(/\s*vbscript\s*:/gi, '');
  html = html.replace(/\s*data\s*:/gi, '');
  
  return html;
};

/**
 * Validates email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

/**
 * Validates CNPJ format (Brazilian business registration)
 */
export const validateCNPJ = (cnpj: string): boolean => {
  cnpj = cnpj.replace(/[^\d]+/g, '');
  
  if (cnpj.length !== 14) return false;
  
  // Check for repeated digits
  if (/^(\d)\1+$/.test(cnpj)) return false;
  
  // Validate check digits
  let length = cnpj.length - 2;
  let pos = cnpj.length - 2;
  let numbers = cnpj.substring(0, pos);
  let digits = cnpj.substring(pos);
  let sum = 0;
  pos = numbers.length - 7;
  
  for (let i = numbers.length; i >= 1; i--) {
    sum += parseInt(numbers.substring(i - 1, i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
  if (result !== parseInt(digits.substring(0, 1))) return false;
  
  length = numbers.length + 1;
  numbers = cnpj.substring(0, length);
  sum = 0;
  pos = numbers.length - 7;
  
  for (let i = numbers.length; i >= 1; i--) {
    sum += parseInt(numbers.substring(i - 1, i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  result = sum % 11 < 2 ? 0 : 11 - sum % 11;
  if (result !== parseInt(digits.substring(1, 2))) return false;
  
  return true;
};

/**
 * Sanitizes and validates text input with length limits
 */
export const sanitizeAndValidateText = (
  text: string, 
  maxLength: number = 1000,
  allowHtml: boolean = false
): { isValid: boolean; sanitized: string; error?: string } => {
  if (!text || typeof text !== 'string') {
    return { isValid: false, sanitized: '', error: 'Texto inválido' };
  }
  
  if (text.length > maxLength) {
    return { 
      isValid: false, 
      sanitized: text, 
      error: `Texto muito longo. Máximo ${maxLength} caracteres.` 
    };
  }
  
  const sanitized = allowHtml ? sanitizeHtml(text) : sanitizeInput(text);
  
  return { isValid: true, sanitized };
};

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    validAttempts.push(now);
    this.attempts.set(identifier, validAttempts);
    return true;
  }
  
  getRemainingTime(identifier: string): number {
    const attempts = this.attempts.get(identifier) || [];
    if (attempts.length === 0) return 0;
    
    const oldestAttempt = Math.min(...attempts);
    const remainingTime = this.windowMs - (Date.now() - oldestAttempt);
    return Math.max(0, remainingTime);
  }
}
