// Development mode utilities
export const isDevelopment = import.meta.env.DEV;
export const hasKeycloakConfig = !!(
  import.meta.env.VITE_KEYCLOAK_URL && 
  import.meta.env.VITE_KEYCLOAK_REALM && 
  import.meta.env.VITE_KEYCLOAK_CLIENT_ID
);

// Check if we should skip Keycloak initialization in development
export const shouldSkipKeycloak = isDevelopment && !hasKeycloakConfig;

console.log('Development Mode Config:', {
  isDevelopment,
  hasKeycloakConfig,
  shouldSkipKeycloak,
  keycloakUrl: import.meta.env.VITE_KEYCLOAK_URL || 'not configured'
});
