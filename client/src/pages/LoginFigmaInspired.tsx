import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useKeycloak } from '@/contexts/KeycloakContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';

// This component recreates the exact Figma design at node-id 383-3088
// Based on the actual Figma API data with precise styling
export default function LoginFigmaInspired() {
  const [, setLocation] = useLocation();
  const { login, directLogin, authenticated, loading } = useKeycloak();
  
  // Form states
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (authenticated) {
      setLocation('/dashboard');
    }
  }, [authenticated, setLocation]);

  const handleKeycloakLogin = async () => {
    setIsLoggingIn(true);
    try {
      await login();
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError('An error occurred during login');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleFormLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const result = await directLogin(email, password);
      if (result.success) {
        setLocation('/dashboard');
      } else {
        setLoginError(result.error || 'An error occurred during login');
      }
    } catch (error) {
      setLoginError('An error occurred during login');
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen relative"
      style={{
        background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 25%, #cce7ff 50%, #b3daff 75%, #9acefd 100%)'
      }}
    >
      {/* Back Button - Top Left Corner */}
      <div className="absolute top-4 left-4 z-50">
        <Button 
          variant="ghost" 
          onClick={() => setLocation('/')}
          className="flex items-center gap-2 text-blue-700 hover:text-blue-900 bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white/90 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </div>

      {/* Decorative Background Elements - More subtle like Figma */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-80 h-80 bg-blue-200 rounded-full opacity-30 blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-300 rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute top-1/2 right-10 w-64 h-64 bg-blue-400 rounded-full opacity-15 blur-xl"></div>
      </div>

      {/* Main Content - Centered Login Card */}
      <div className="flex items-center justify-center min-h-screen px-6 relative z-10">
        {/* Login Card - White Background */}
        <div 
          className="bg-white rounded-xl shadow-lg p-8"
          style={{ width: '400px', minHeight: '500px' }}
        >
          {/* Title */}
          <h1 
            className="text-gray-900 mb-2 text-center"
            style={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              fontWeight: 600,
              fontSize: '28px',
              lineHeight: '1.2'
            }}
          >
            Log in
          </h1>

          {/* Description */}
          <p 
            className="text-gray-600 text-center mb-6"
            style={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '1.4'
            }}
          >
            Hi there!<br />
            Enter your information to log in to your account.
          </p>

          {/* Error Message */}
          {loginError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription className="text-sm">{loginError}</AlertDescription>
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleFormLogin} className="space-y-4">
            {/* Email Input */}
            <div>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
                style={{
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontSize: '14px'
                }}
                placeholder="Email or Username"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
                  style={{
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                    fontSize: '14px'
                  }}
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-gray-300"
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              <Button 
                type="button"
                variant="link" 
                className="text-blue-600 hover:text-blue-700 p-0 h-auto text-sm"
              >
                Forgot password?
              </Button>
            </div>

            {/* Login Button - Blue */}
            <Button 
              type="submit" 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-base"
              style={{
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
              }}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>

            {/* Microsoft Login Button */}
            <Button 
              type="button"
              variant="outline" 
              className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium text-base flex items-center justify-center gap-3"
              style={{
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
              }}
              onClick={handleKeycloakLogin}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 21 21" fill="none">
                    <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                    <rect x="12" y="1" width="9" height="9" fill="#00a4ef"/>
                    <rect x="1" y="12" width="9" height="9" fill="#ffb900"/>
                    <rect x="12" y="12" width="9" height="9" fill="#7fba00"/>
                  </svg>
                  Continue with Microsoft
                </>
              )}
            </Button>

            {/* Terms */}
            <p className="text-center text-xs text-gray-500 mt-6">
              By continuing, you agree to the{' '}
              <Button variant="link" className="text-blue-600 hover:text-blue-700 p-0 h-auto text-xs">
                Terms
              </Button>
              {' '}and{' '}
              <Button variant="link" className="text-blue-600 hover:text-blue-700 p-0 h-auto text-xs">
                Privacy Policy
              </Button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
