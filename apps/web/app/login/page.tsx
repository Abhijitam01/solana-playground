'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoginModal } from '@/components/auth/LoginModal';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = () => {
    const redirectTo = searchParams.get('next') || '/playground/hello-solana';
    router.push(decodeURIComponent(redirectTo));
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0" />
      <LoginModal isOpen={true} onClose={handleClose} />
    </div>
  );
}
