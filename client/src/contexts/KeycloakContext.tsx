import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
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
        // Try to load token from localStorage first
        const hasStoredToken = loadTokenFromStorage();
        if (hasStoredToken) {
          setAuthenticated(true);
          setToken(keycloak.token || null);
          if (keycloak.tokenParsed) {
            setUser(keycloak.tokenParsed);
          }
          setLoading(false);
          return;
        }
        
        const authenticated = await keycloak.init(keycloakInitOptions);
        setAuthenticated(authenticated);
        setToken(keycloak.token || null);
        
        if (authenticated && keycloak.tokenParsed) {
          setUser(keycloak.tokenParsed);
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

  const handleLogin = () => {
    if (keycloak && typeof keycloak.login === 'function') {
      keycloak.login({
        redirectUri: window.location.href, // Return to current page after login
      });
    } else {
      console.error('Keycloak instance not available for login');
      throw new Error('Authentication service is not available');
    }
  };

  const handleDirectLogin = async (username: string, password: string) => {
    try {
      const result = await directLogin(username, password);
      if (result.success) {
        setAuthenticated(true);
        setToken(keycloak.token || null);
        if (keycloak.tokenParsed) {
          setUser(keycloak.tokenParsed);
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
  };

  const handleLogout = () => {
    // Clear token from localStorage
    clearTokenStorage();
    
    // Reset local state
    setAuthenticated(false);
    setToken(null);
    setUser(null);
    
    // Perform Keycloak logout - check if keycloak instance exists and has logout method
    try {
      if (keycloak && typeof keycloak.logout === 'function') {
        keycloak.logout({
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

  const value: KeycloakContextType = {
    keycloak,
    authenticated,
    loading,
    user,
    login: handleLogin,
    directLogin: handleDirectLogin,
    logout: handleLogout,
    token,
  };

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
