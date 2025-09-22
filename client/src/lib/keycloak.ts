import Keycloak from 'keycloak-js';

// Keycloak configuration
const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'orion',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'orion-client',
};

// Debug logging
console.log('Keycloak Config:', keycloakConfig);
console.log('Environment variables:', {
  VITE_KEYCLOAK_URL: import.meta.env.VITE_KEYCLOAK_URL,
  VITE_KEYCLOAK_REALM: import.meta.env.VITE_KEYCLOAK_REALM,
  VITE_KEYCLOAK_CLIENT_ID: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
});

// Initialize Keycloak instance
const keycloak = new Keycloak(keycloakConfig);

// ฟังก์ชันสำหรับโหลด token จาก localStorage
export const loadTokenFromStorage = () => {
  try {
    const token = localStorage.getItem('kc-token');
    const refreshToken = localStorage.getItem('kc-refresh-token');
    const tokenParsedStr = localStorage.getItem('kc-token-parsed');
    
    if (token && refreshToken && tokenParsedStr) {
      const tokenParsed = JSON.parse(tokenParsedStr);
      
      // ตรวจสอบว่า token ยังไม่หมดอายุ
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

// ฟังก์ชันสำหรับลบ token จาก localStorage
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
  // กำหนดให้ redirect กลับมาหน้าปัจจุบันหลัง login
  flow: 'standard' as const,
};

export default keycloak;

// Helper functions
export const login = () => {
  return keycloak.login({
    redirectUri: window.location.href, // กลับมาหน้าเดิมที่ user กดไป
  });
};

// Direct login function - ใช้สำหรับ login ผ่าน form ใน frontend
export const directLogin = async (username: string, password: string) => {
  const tokenUrl = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`;
  
  // ใช้ URLSearchParams แทน FormData สำหรับ application/x-www-form-urlencoded
  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('client_id', keycloakConfig.clientId);
  params.append('username', username);
  params.append('password', password);

  console.log('Direct login attempt:', {
    url: tokenUrl,
    clientId: keycloakConfig.clientId,
    username: username
  });

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Login error response:', errorText);
      try {
        const error = JSON.parse(errorText);
        throw new Error(error.error_description || error.error || 'Login failed');
      } catch (parseError) {
        throw new Error(`Login failed: ${response.status} ${response.statusText}`);
      }
    }

    const tokenData = await response.json();
    console.log('Token received successfully:', { 
      hasAccessToken: !!tokenData.access_token,
      expiresIn: tokenData.expires_in 
    });
    
    // ตั้งค่า token ใน Keycloak instance
    keycloak.token = tokenData.access_token;
    keycloak.refreshToken = tokenData.refresh_token;
    keycloak.tokenParsed = JSON.parse(atob(tokenData.access_token.split('.')[1]));
    keycloak.authenticated = true;
    
    // คำนวณเวลาหมดอายุ
    const now = new Date().getTime();
    keycloak.timeSkew = 0;
    if (tokenData.expires_in) {
      keycloak.tokenParsed.exp = Math.floor(now / 1000) + tokenData.expires_in;
    }
    
    // บันทึก token ใน localStorage สำหรับ persistence
    localStorage.setItem('kc-token', tokenData.access_token);
    localStorage.setItem('kc-refresh-token', tokenData.refresh_token);
    localStorage.setItem('kc-token-parsed', JSON.stringify(keycloak.tokenParsed));
    
    // เรียก callback events
    if (keycloak.onAuthSuccess) {
      keycloak.onAuthSuccess();
    }
    
    return {
      success: true,
      token: tokenData.access_token,
      user: keycloak.tokenParsed
    };
  } catch (error) {
    console.error('Direct login error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const logout = () => {
  // ลบ token จาก localStorage
  clearTokenStorage();
  
  return keycloak.logout({
    redirectUri: window.location.origin, // logout แล้วกลับไป home page
  });
};

export const getToken = () => keycloak.token;
export const isLoggedIn = () => !!keycloak.token;
export const updateToken = (minValidity: number = 30) => keycloak.updateToken(minValidity);
export const getUserInfo = () => keycloak.tokenParsed;
