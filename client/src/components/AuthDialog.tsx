import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useKeycloak } from '@/contexts/KeycloakContext';
import { Eye, EyeOff } from 'lucide-react';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

export const AuthDialog: React.FC<AuthDialogProps> = ({
  open,
  onOpenChange,
  title = "Log in",
  description = "Sign in to unlock the full power of AI-driven financial analysis"
}) => {
  const { login, directLogin, loading } = useKeycloak();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleKeycloakLogin = async () => {
    setIsLoggingIn(true);
    try {
      await login();
      onOpenChange(false);
    } catch (error) {
      console.error('Login failed:', error);
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
        onOpenChange(false);
      } else {
        setLoginError(result.error || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      }
    } catch (error) {
      setLoginError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[440px] max-h-[90vh] p-0 gap-0 overflow-y-auto">
        {/* Header Section */}
        <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6">
          <DialogHeader className="text-left space-y-2 sm:space-y-3">
            <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              {title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>
        
        {/* Form Section */}
        <div className="px-6 sm:px-8 pb-6 sm:pb-8">
          <form onSubmit={handleFormLogin} className="space-y-4 sm:space-y-5">
            {/* Error Message */}
            {loginError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {loginError}
              </div>
            )}
            
            {/* Email/Username Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email or Username
              </Label>
              <Input
                id="email"
                type="text"
                placeholder="Enter your email or username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 sm:h-11 bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-colors rounded-lg text-base sm:text-sm"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 sm:h-11 bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-colors rounded-lg pr-12 text-base sm:text-sm"
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="remember" className="text-sm font-medium text-foreground cursor-pointer">
                  Remember me
                </Label>
              </div>
              <Button variant="link" className="p-0 h-auto text-sm text-primary hover:text-primary/80 font-medium">
                Forgot password?
              </Button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loading || isLoggingIn}
              className="w-full h-12 sm:h-11 text-base font-semibold bg-[#1e3a8a] hover:bg-[#1e40af] text-white rounded-lg shadow-sm transition-all duration-200 hover:shadow-md mt-6"
            >
              {isLoggingIn ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-3 text-muted-foreground font-medium">
                  OR CONTINUE WITH
                </span>
              </div>
            </div>

            {/* Microsoft Login */}
            <Button
              type="button"
              variant="outline"
              onClick={handleKeycloakLogin}
              disabled={loading || isLoggingIn}
              className="w-full h-12 sm:h-11 text-base font-medium border border-border hover:border-border hover:bg-muted/30 rounded-lg transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 grid grid-cols-2 gap-0.5 rounded-sm overflow-hidden">
                  <div className="bg-[#f25022]"></div>
                  <div className="bg-[#7fba00]"></div>
                  <div className="bg-[#00a4ef]"></div>
                  <div className="bg-[#ffb900]"></div>
                </div>
                Continue with Microsoft
              </div>
            </Button>

            {/* Terms */}
            <div className="text-center text-xs text-muted-foreground leading-relaxed pt-4 pb-2">
              By continuing, you agree to our{' '}
              <Button variant="link" className="p-0 h-auto text-xs text-primary hover:text-primary/80 underline font-medium">
                Terms of Service
              </Button>{' '}
              and{' '}
              <Button variant="link" className="p-0 h-auto text-xs text-primary hover:text-primary/80 underline font-medium">
                Privacy Policy
              </Button>
              .
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
