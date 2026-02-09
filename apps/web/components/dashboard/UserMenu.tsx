'use client';

import { useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface UserMenuProps {
  user: any;
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const supabase = createSupabaseClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#14F195] to-[#00D18C] flex items-center justify-center">
          <User className="w-4 h-4 text-black" />
        </div>
        <span className="text-sm font-medium text-white hidden md:block">
          {user.email?.split('@')[0]}
        </span>
        <ChevronDown className="w-4 h-4 text-white/60" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-56 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg z-20 overflow-hidden"
            >
              <div className="p-3 border-b border-white/10">
                <p className="text-sm font-medium text-white">{user.email}</p>
                <p className="text-xs text-white/60">Free Plan</p>
              </div>

              <div className="py-2">
                <button
                  onClick={() => {
                    // router.push('/settings'); // V2
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-white/60 hover:bg-white/5 transition-colors opacity-50 cursor-not-allowed"
                  title="Coming soon"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
