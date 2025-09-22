import React, { useState } from 'react';
import { useKeycloak } from '@/contexts/KeycloakContext';
import { AuthDialog } from '@/components/AuthDialog';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, LogIn } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { authenticated, loading } = useKeycloak();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // Debug logging
  console.log('ProtectedRoute - authenticated:', authenticated, 'loading:', loading);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">กำลังตรวจสอบการเข้าสู่ระบบ...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    // แสดง popup login dialog เหมือนหน้า landing page
    return (
      <>
        {/* แสดงหน้า landing page แบบ blurred background */}
        <div className="min-h-screen bg-background relative">
          {/* Blurred overlay */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-40"></div>
          
          {/* Landing page content (blurred in background) */}
          <div className="relative z-30 opacity-50 pointer-events-none">
            <div className="min-h-screen bg-background">
              <Navigation />
              <main>
                <Hero />
              </main>
            </div>
          </div>
        </div>

        {/* Auth Dialog Popup - แสดงทันทีเมื่อเข้าหน้า */}
        <AuthDialog
          open={true}
          onOpenChange={() => {}} // ป้องกันการปิด popup
          title="เข้าสู่ระบบ Orion"
          description="เข้าสู่ระบบเพื่อใช้งาน AI Finance Platform"
        />
      </>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
