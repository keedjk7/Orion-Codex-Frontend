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
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        // ลองโหลด token จาก localStorage ก่อน
        const hasStoredToken = loadTokenFromStorage();
        if (hasStoredToken) {
          console.log('Found stored token, user is already authenticated');
          setAuthenticated(true);
          setToken(keycloak.token || null);
          if (keycloak.tokenParsed) {
            setUser(keycloak.tokenParsed);
          }
          setLoading(false);
          return;
        }
        
        console.log('No stored token, initializing Keycloak with options:', keycloakInitOptions);
        const authenticated = await keycloak.init(keycloakInitOptions);
        
        console.log('Keycloak initialized. Authenticated:', authenticated);
        setAuthenticated(authenticated);
        setToken(keycloak.token || null);
        
        if (authenticated && keycloak.tokenParsed) {
          setUser(keycloak.tokenParsed);
        }

        // Set up token refresh
        keycloak.onTokenExpired = () => {
          keycloak.updateToken(30).then((refreshed) => {
            if (refreshed) {
              setToken(keycloak.token || null);
              console.log('Token refreshed');
            } else {
              console.log('Token not refreshed, valid for ' + Math.round(keycloak.tokenParsed?.exp! + keycloak.timeSkew! - new Date().getTime() / 1000) + ' seconds');
            }
          }).catch(() => {
            console.error('Failed to refresh token');
            handleLogout();
          });
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
        console.log('Keycloak initialization complete. Final state:', {
          authenticated,
          loading: false,
          hasToken: !!keycloak.token
        });
      }
    };

    initKeycloak();
  }, []);

  const handleLogin = () => {
    keycloak.login({
      redirectUri: window.location.href, // กลับมาหน้าเดิมที่ user กดไป
    });
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
        error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' 
      };
    }
  };

  const handleLogout = () => {
    // ลบ token จาก localStorage
    clearTokenStorage();
    
    // Reset local state
    setAuthenticated(false);
    setToken(null);
    setUser(null);
    
    // ทำ Keycloak logout
    keycloak.logout({
      redirectUri: window.location.origin, // logout แล้วกลับไป home page
    });
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
