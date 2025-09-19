# คู่มือการแก้ไขปัญหา Session Persistence

## ปัญหาที่เกิดขึ้น
หลังจาก login แล้ว เมื่อกด "Get Started" อีกครั้ง หรือ refresh หน้า จะต้อง sign in อีกครั้ง

## สาเหตุ
1. Keycloak Direct Login ไม่ได้จัดเก็บ token ใน browser storage
2. เมื่อ refresh หน้า authentication state จะหายไป
3. ไม่มีการตรวจสอบ stored token เมื่อแอปเริ่มต้น

## การแก้ไขที่ทำไป

### ✅ 1. เพิ่ม Token Storage ใน `keycloak.ts`

```typescript
// บันทึก token ใน localStorage หลัง direct login สำเร็จ
localStorage.setItem('kc-token', tokenData.access_token);
localStorage.setItem('kc-refresh-token', tokenData.refresh_token);
localStorage.setItem('kc-token-parsed', JSON.stringify(keycloak.tokenParsed));
```

### ✅ 2. เพิ่มฟังก์ชัน `loadTokenFromStorage()`

```typescript
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
        return true;
      }
    }
  } catch (error) {
    clearTokenStorage();
  }
  return false;
};
```

### ✅ 3. อัปเดต KeycloakContext Initialization

```typescript
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
```

### ✅ 4. อัปเดต Logout Functions

```typescript
const handleLogout = () => {
  // ลบ token จาก localStorage
  clearTokenStorage();
  
  // Reset local state
  setAuthenticated(false);
  setToken(null);
  setUser(null);
  
  // ทำ Keycloak logout
  keycloak.logout({
    redirectUri: window.location.origin,
  });
};
```

## วิธีการทดสอบ

### ขั้นตอนที่ 1: ทดสอบ Login และ Persistence
1. เปิด http://localhost:5000
2. คลิก "Get Started"
3. Login ด้วย testuser/password123
4. หลัง login สำเร็จ ให้ refresh หน้า (F5)
5. **ควรจะยังคง login อยู่ ไม่ต้อง sign in อีก**

### ขั้นตอนที่ 2: ทดสอบการกด Get Started หลัง Login
1. หลังจาก login แล้ว
2. คลิกปุ่ม "Get Started" อีกครั้ง
3. **ควรจะเข้าสู่แอปได้เลย ไม่ต้องแสดง login dialog**

### ขั้นตอนที่ 3: ทดสอบ Logout
1. คลิกปุ่ม "Logout" (หากมี)
2. ควรจะกลับไปหน้า landing page
3. localStorage ควรจะถูกลบ
4. หากคลิก "Get Started" อีกครั้งจะต้อง login ใหม่

## สิ่งที่ควรเห็นใน Console

### เมื่อ Login ครั้งแรก:
```
Direct login attempt: {url: "...", clientId: "orion-client", username: "testuser"}
Token received successfully: {hasAccessToken: true, expiresIn: 300}
```

### เมื่อ Refresh หน้า:
```
Found stored token, user is already authenticated
Token loaded from storage, expires in: 298 seconds
```

### เมื่อ Token หมดอายุ:
```
Stored token expired, clearing storage
```

## ข้อดีของการแก้ไข

### ✅ User Experience ที่ดีขึ้น:
- ไม่ต้อง login ซ้ำหลัง refresh
- Session คงอยู่ตาม token expiry time
- ไม่ต้องกด "Get Started" แล้ว login ซ้ำ

### ✅ Security:
- ตรวจสอบ token expiry ก่อนใช้
- ลบ token เมื่อ logout
- ใช้ localStorage (persistent) แทน sessionStorage

### ✅ Performance:
- โหลดเร็วขึ้นเมื่อมี stored token
- ลด network requests ไม่จำเป็น

## หมายเหตุ

- Token จะหมดอายุใน 5 นาที (300 วินาที) ตาม Keycloak default
- หลังหมดอายุจะต้อง login ใหม่
- localStorage จะคงอยู่แม้ปิดเบราว์เซอร์
- สำหรับ production ควรพิจารณาใช้ secure cookie หรือ httpOnly cookie
