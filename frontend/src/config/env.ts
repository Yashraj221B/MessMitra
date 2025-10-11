// Environment configuration

interface EnvConfig {
  API_URL: string;
  IS_DEVELOPMENT: boolean;
  IS_PRODUCTION: boolean;
}

const getEnvConfig = (): EnvConfig => {
  const isDevelopment = import.meta.env.DEV;
  const isProduction = import.meta.env.PROD;

  return {
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    IS_DEVELOPMENT: isDevelopment,
    IS_PRODUCTION: isProduction,
  };
};

export const ENV = getEnvConfig();

export default ENV;
