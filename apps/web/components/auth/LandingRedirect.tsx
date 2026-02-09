'use client';

import React from "react";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseClient } from '@/lib/supabase';

export function LandingRedirect({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createSupabaseClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push('/dashboard');
      }
    };
    
    checkAuth();
  }, [router, supabase]);

  return <>{children}</>;
}
