import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo, useCallback } from 'react';
import keycloak, { keycloakInitOptions, directLogin, loadTokenFromStorage, clearTokenStorage } from '@/lib/keycloak';
import type { KeycloakInstance } from 'keycloak-js';

interface KeycloakContextType {
  keycloak: KeycloakInstance | null;
  authenticated: boolean;
  loading: boolean;
  user: any;
  login: () => void;
  directLogin: (username: string, password: string) => Promise<{success: boolean, error?: string}>;
  logout: () => void;
  token: string | null;
}

const KeycloakContext = createContext<KeycloakContextType | undefined>(undefined);

export const useKeycloak = () => {
  const context = useContext(KeycloakContext);
  if (context === undefined) {
    throw new Error('useKeycloak must be used within a KeycloakProvider');
  }
  return context;
};

interface KeycloakProviderProps {
  children: ReactNode;
}

export const KeycloakProvider: React.FC<KeycloakProviderProps> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        // Try to load token from localStorage first - this is much faster
        const hasStoredToken = loadTokenFromStorage();
        if (hasStoredToken) {
          // Batch state updates to prevent multiple re-renders
          setAuthenticated(true);
          setToken(keycloak.token || null);
          if (keycloak.tokenParsed) {
            setUser(keycloak.tokenParsed);
          }
          setLoading(false);
          return;
        }
        
        // Try Keycloak init if we have a server configured (including localhost:8080)
        const isKeycloakConfigured = import.meta.env.VITE_KEYCLOAK_URL;
        
        if (isKeycloakConfigured) {
          const authenticated = await keycloak.init(keycloakInitOptions);
          setAuthenticated(authenticated);
          setToken(keycloak.token || null);
          
          if (authenticated && keycloak.tokenParsed) {
            setUser(keycloak.tokenParsed);
          }
        } else {
          // Skip Keycloak initialization for development/demo mode
          console.log('Keycloak not configured, using demo mode');
          setAuthenticated(false);
        }

        // Set up token refresh
        keycloak.onTokenExpired = () => {
          if (keycloak && typeof keycloak.updateToken === 'function') {
            keycloak.updateToken(30).then((refreshed) => {
              if (refreshed) {
                setToken(keycloak.token || null);
              } else {
                // Token still valid
              }
            }).catch((error) => {
              console.error('Failed to refresh token:', error);
              handleLogout();
            });
          } else {
            console.warn('Keycloak instance not available for token refresh');
            handleLogout();
          }
        };

        // Set up auth events
        keycloak.onAuthSuccess = () => {
          setAuthenticated(true);
          setToken(keycloak.token || null);
          if (keycloak.tokenParsed) {
            setUser(keycloak.tokenParsed);
            // Redirect to home page after successful authentication
            setTimeout(() => {
              window.location.href = '/home';
            }, 100);
          }
        };

        keycloak.onAuthLogout = () => {
          setAuthenticated(false);
          setToken(null);
          setUser(null);
        };

      } catch (error) {
        console.error('Failed to initialize Keycloak:', error);
        // Set authenticated to false if Keycloak fails
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initKeycloak();
  }, []);

  const handleLogin = useCallback(() => {
    if (keycloak && typeof keycloak.login === 'function') {
      keycloak.login({
        redirectUri: `${window.location.origin}/home`, // Redirect to home page after login
      });
    } else {
      console.error('Keycloak instance not available for login');
      throw new Error('Authentication service is not available');
    }
  }, []);

  const handleDirectLogin = useCallback(async (username: string, password: string) => {
    try {
      const result = await directLogin(username, password);
      if (result.success) {
        // Batch state updates for better performance
        setAuthenticated(true);
        setToken(keycloak.token || null);
        if (keycloak.tokenParsed) {
          setUser(keycloak.tokenParsed);
          // Redirect to home page after successful authentication
          setTimeout(() => {
            window.location.href = '/home';
          }, 100);
        }
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred during login'
      };
    }
  }, []);

  const handleLogout = useCallback(() => {
    // Clear token from localStorage first for immediate effect
    clearTokenStorage();
    
    // Batch state updates to prevent multiple re-renders
    setAuthenticated(false);
    setToken(null);
    setUser(null);
    
    // Perform Keycloak logout asynchronously to avoid blocking UI
    const performLogout = async () => {
      try {
        if (keycloak && typeof keycloak.logout === 'function') {
          await keycloak.logout({
            redirectUri: window.location.origin, // logout and return to home page
          });
        } else {
          // If keycloak is not available, redirect to home page directly
          console.warn('Keycloak instance not available, redirecting to home page');
          window.location.href = window.location.origin;
        }
      } catch (error) {
        console.error('Error during logout:', error);
        // If error occurs, redirect to home page directly
        window.location.href = window.location.origin;
      }
    };
    
    // Don't await this to make logout feel instant
    performLogout();
  }, []);

  const value: KeycloakContextType = useMemo(() => ({
    keycloak,
    authenticated,
    loading,
    user,
    login: handleLogin,
    directLogin: handleDirectLogin,
    logout: handleLogout,
    token,
  }), [authenticated, loading, user, token, handleLogin, handleDirectLogin, handleLogout]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <KeycloakContext.Provider value={value}>
      {children}
    </KeycloakContext.Provider>
  );
};
