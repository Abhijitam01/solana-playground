'use client';

import Link from 'next/link';

export default function AuthCodeError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-bold mb-4">Authentication Error</h1>
      <p className="text-lg text-white/60 mb-8">
        There was an error verifying your login. Please try again.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-[#14F195] text-black rounded-lg font-medium hover:opacity-90 transition-opacity"
      >
        Return Home
      </Link>
    </div>
  );
}
