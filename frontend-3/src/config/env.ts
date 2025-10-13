// Environment configuration

interface EnvConfig {
  API_URL: string;
  IS_DEVELOPMENT: boolean;
  IS_PRODUCTION: boolean;
  ENABLE_MOCK_API: boolean;
}

const getEnvConfig = (): EnvConfig => {
  const isDevelopment = import.meta.env.DEV;
  const isProduction = import.meta.env.PROD;

  return {
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    IS_DEVELOPMENT: isDevelopment,
    IS_PRODUCTION: isProduction,
    ENABLE_MOCK_API: import.meta.env.VITE_ENABLE_MOCK_API === 'true' || isDevelopment,
  };
};

export const ENV = getEnvConfig();

export default ENV;
