'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient();

      // PKCE flow: Supabase sends the code as a query parameter
      const code = searchParams?.get('code');
      const errorDesc = searchParams?.get('error_description');

      if (code) {
        // Exchange the PKCE code for a session
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setError(error.message);
          return;
        }
      } else if (errorDesc) {
        setError(errorDesc);
        return;
      }

      // Check if we have a session now
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Could not complete sign in. No session found.');
        return;
      }

      // Check if this was a password recovery flow
      const type = searchParams?.get('type');
      if (type === 'recovery') {
        router.push('/auth/update-password');
      } else {
        showToastAndRedirect(session.user.email || '');
      }
    };

    handleCallback();
  }, [router, searchParams]);

  const showToastAndRedirect = (email: string) => {
    // We don't have access to showToast here, so just redirect
    router.push('/');
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5]">
        <div className="text-center max-w-sm px-6">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Authentication Error</h2>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <a href="/auth/login"
            className="inline-block w-full py-3 rounded-xl accent-gradient text-white font-semibold hover:opacity-90 text-center">
            Go to Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5]">
      <div className="flex flex-col items-center gap-4">
        <img src="/Logo.png" alt="SproutHR" className="h-16 w-auto animate-pulse" />
        <span className="text-sm text-gray-400">Completing sign in...</span>
      </div>
    </div>
  );
}
