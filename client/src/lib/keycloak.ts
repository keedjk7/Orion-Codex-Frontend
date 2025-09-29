import Keycloak from 'keycloak-js';

// Keycloak configuration (optional - for future Keycloak integration)
const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'orion',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'orion-client',
};

// Initialize Keycloak instance
const keycloak = new Keycloak(keycloakConfig);

// Helper function to load token from localStorage
export const loadTokenFromStorage = () => {
  try {
    const token = localStorage.getItem('kc-token');
    const refreshToken = localStorage.getItem('kc-refresh-token');
    const tokenParsedStr = localStorage.getItem('kc-token-parsed');
    
    if (token && refreshToken && tokenParsedStr) {
      const tokenParsed = JSON.parse(tokenParsedStr);
      
      // Check if token is still valid
      const now = Math.floor(Date.now() / 1000);
      if (tokenParsed.exp && tokenParsed.exp > now) {
        keycloak.token = token;
        keycloak.refreshToken = refreshToken;
        keycloak.tokenParsed = tokenParsed;
        keycloak.authenticated = true;
        
        console.log('Token loaded from storage, expires in:', tokenParsed.exp - now, 'seconds');
        return true;
      } else {
        console.log('Stored token expired, clearing storage');
        clearTokenStorage();
      }
    }
  } catch (error) {
    console.error('Error loading token from storage:', error);
    clearTokenStorage();
  }
  return false;
};

// Helper function to clear token from localStorage
export const clearTokenStorage = () => {
  localStorage.removeItem('kc-token');
  localStorage.removeItem('kc-refresh-token');
  localStorage.removeItem('kc-token-parsed');
};

// Keycloak initialization options
export const keycloakInitOptions = {
  onLoad: 'check-sso' as const,
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
  checkLoginIframe: false,
  pkceMethod: 'S256' as const,
  // Set to redirect back to current page after login
  flow: 'standard' as const,
};

export default keycloak;

// Helper functions
export const login = () => {
  return keycloak.login({
    redirectUri: `${window.location.origin}/home`, // Redirect to home page after login
  });
};

// Test accounts for demo purposes
const testAccounts = [
  { username: 'admin', password: 'admin123', email: 'admin@orion.com', firstName: 'Admin', lastName: 'User', role: 'admin' },
  { username: 'testuser', password: 'test123', email: 'test@orion.com', firstName: 'Test', lastName: 'User', role: 'user' },
  { username: 'demo', password: 'demo123', email: 'demo@orion.com', firstName: 'Demo', lastName: 'Account', role: 'demo' },
];

// Direct login function - supports both test accounts and real Keycloak
export const directLogin = async (username: string, password: string) => {
  // Try test accounts first for demo/development - this is much faster than network calls
  const testAccount = testAccounts.find(account => 
    (account.username === username || account.email === username) && account.password === password
  );

  if (testAccount) {
    // Create mock token with better performance
    const now = Math.floor(Date.now() / 1000);
    const mockTokenData = {
      sub: testAccount.username,
      email: testAccount.email,
      given_name: testAccount.firstName,
      family_name: testAccount.lastName,
      preferred_username: testAccount.username,
      role: testAccount.role,
      exp: now + 3600, // 1 hour
      iat: now,
      iss: 'orion-demo'
    };

    // Use more efficient token generation
    const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
    const payload = btoa(JSON.stringify(mockTokenData));
    const mockToken = `${header}.${payload}.`;

    // Batch all Keycloak instance updates
    Object.assign(keycloak, {
      token: mockToken,
      refreshToken: 'mock-refresh-token',
      tokenParsed: mockTokenData,
      authenticated: true,
      timeSkew: 0
    });
    
    // Batch localStorage operations for better performance
    const tokenData = {
      'kc-token': mockToken,
      'kc-refresh-token': 'mock-refresh-token',
      'kc-token-parsed': JSON.stringify(mockTokenData)
    };
    
    Object.entries(tokenData).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
    
    // Trigger callback events asynchronously to avoid blocking
    if (keycloak.onAuthSuccess) {
      setTimeout(() => keycloak.onAuthSuccess(), 0);
    }
    
    return {
      success: true,
      token: mockToken,
      user: mockTokenData
    };
  }

  // If test account not found, try real Keycloak (if available)
  const tokenUrl = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`;
  
  // Use URLSearchParams instead of FormData for application/x-www-form-urlencoded
  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('client_id', keycloakConfig.clientId);
  params.append('username', username);
  params.append('password', password);

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      return {
        success: false,
        error: 'Invalid username or password. Try: admin/admin123, testuser/test123, or demo/demo123'
      };
    }

    const tokenData = await response.json();
    
    // Set token values in Keycloak instance
    keycloak.token = tokenData.access_token;
    keycloak.refreshToken = tokenData.refresh_token;
    keycloak.tokenParsed = JSON.parse(atob(tokenData.access_token.split('.')[1]));
    keycloak.authenticated = true;
    
    // Calculate expiration time
    const now = new Date().getTime();
    keycloak.timeSkew = 0;
    if (tokenData.expires_in && keycloak.tokenParsed) {
      keycloak.tokenParsed.exp = Math.floor(now / 1000) + tokenData.expires_in;
    }
    
    // Store token in localStorage for persistence
    localStorage.setItem('kc-token', tokenData.access_token);
    localStorage.setItem('kc-refresh-token', tokenData.refresh_token);
    localStorage.setItem('kc-token-parsed', JSON.stringify(keycloak.tokenParsed));
    
    // Trigger callback events
    if (keycloak.onAuthSuccess) {
      keycloak.onAuthSuccess();
    }
    
    return {
      success: true,
      token: tokenData.access_token,
      user: keycloak.tokenParsed
    };
  } catch (error) {
    return {
      success: false,
      error: 'Unable to connect to authentication server. Try: admin/admin123, testuser/test123, or demo/demo123'
    };
  }
};

export const logout = () => {
  // Clear token from localStorage immediately for instant feedback
  clearTokenStorage();
  
  // Clear keycloak instance state immediately
  Object.assign(keycloak, {
    token: null,
    refreshToken: null,
    tokenParsed: null,
    authenticated: false
  });
  
  try {
    if (keycloak && typeof keycloak.logout === 'function') {
      // Use async logout to avoid blocking UI
      return keycloak.logout({
        redirectUri: window.location.origin, // logout and return to home page
      });
    } else {
      // If keycloak is not available, redirect to home page directly
      console.warn('Keycloak instance not available, redirecting to home page');
      // Use setTimeout to avoid blocking the current execution
      setTimeout(() => {
        window.location.href = window.location.origin;
      }, 0);
      return Promise.resolve();
    }
  } catch (error) {
    console.error('Error during logout:', error);
    // If error occurs, redirect to home page directly
    setTimeout(() => {
      window.location.href = window.location.origin;
    }, 0);
    return Promise.resolve();
  }
};

export const getToken = () => keycloak.token;
export const isLoggedIn = () => !!keycloak.token;
export const updateToken = (minValidity: number = 30) => keycloak.updateToken(minValidity);
export const getUserInfo = () => keycloak.tokenParsed;
