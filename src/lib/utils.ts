// Você pode remover o import de 'next/dist/server/api-utils' se sua ApiError
// for a interface customizada de erro do Axios/Backend.

// Definimos o tipo de 'e' como um objeto genérico para acesso seguro.
type ErrorWithResponse = Record<string, unknown> & {
    response: Record<string, unknown> & {
      data: Record<string, unknown>;
    };
  };
  
  
  export const isApiError = (error: unknown): error is ApiError => {
      // 1. Verifica se o erro é um objeto e não é nulo
      if (typeof error !== 'object' || error === null) {
          return false;
      }
  
      const e = error as ErrorWithResponse;
  
      // 2. Verifica se 'response' existe, é um objeto e não é nulo
      if (!('response' in e) || typeof e.response !== 'object' || e.response === null) {
          return false;
      }
      
      // 3. Verifica se 'data' existe dentro de 'response', é um objeto e não é nulo
      if (!('data' in e.response) || typeof e.response.data !== 'object' || e.response.data === null) {
          return false;
      }
  
      // 4. Verifica se 'message' existe dentro de 'data' e é uma string
      const data = e.response.data;
  
      return (
          'message' in data && 
          typeof data.message === 'string'
      );
  };

  export interface ApiError {
    // A propriedade 'response' é obrigatória e deve ter a estrutura de dados
    response: {
        data: {
            // A mensagem de erro específica do backend
            message: string; 
            [key: string]: unknown; // Permite outros campos em 'data'
        };
        status?: number; // Opcional, mas útil
        [key: string]: unknown; // Permite outros campos na resposta
    };
    // Adiciona o campo 'message' padrão do objeto Error
    message?: string; 
    
    // Adicione esta linha se estiver usando Axios e quiser ser mais explícito
    // isAxiosError?: boolean;
}

interface ApiResponseError {
    response?: {
        data?: {
            message?: string;
        };
    };
    message?: string; // Para erros padrão
    // Adicione outras propriedades conhecidas se necessário
}

// Type guard para verificar se o erro tem a estrutura de uma resposta de API (Axios-like)
export const isApiResponseError = (err: unknown): err is ApiResponseError => {
    // Verifica se é um objeto e tem a propriedade 'response'
    return (
        typeof err === 'object' && 
        err !== null && 
        'response' in err
    );
};

interface ApiValidationErrors {
    response: {
      data: {
        // O campo 'message' é um array de strings para erros de validação
        message: string[];
      };
      [key: string]: unknown;
    };
    [key: string]: unknown;
  }
  
  // Type guard para verificar se o objeto é um erro de validação da API
  export const isApiValidationError = (error: unknown): error is ApiValidationErrors => {
    return (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      (error as ApiValidationErrors).response?.data?.message !== undefined &&
      Array.isArray((error as ApiValidationErrors).response.data.message)
    );
  };