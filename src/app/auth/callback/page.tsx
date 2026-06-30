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

      // Try to get the PKCE code (query param) or hash params
      let code = searchParams?.get('code');
      let type = searchParams?.get('type');
      let errorDesc = searchParams?.get('error_description');

      // Also check the URL hash (implicit fallback for some Supabase flows)
      if (!code && !type && !errorDesc) {
        const hash = window.location.hash.replace('#', '');
        const hashParams = new URLSearchParams(hash);
        if (!code) code = hashParams.get('access_token');
        if (!type) {
          type = hashParams.get('type');
          // Map Supabase implicit flow types
          if (type === 'signup') type = 'signup';
          if (type === 'recovery') type = 'recovery';
        }
      }

      if (code) {
        // PKCE: exchange the code for a session
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

      // Determine where to redirect based on flow type
      if (type === 'recovery') {
        router.push('/auth/update-password');
      } else {
        router.push('/');
      }
    };

    handleCallback();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="page-transition min-h-screen flex items-center justify-center bg-[#f0f2f5] py-20 px-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <a href="/auth/login"
            className="inline-block w-full py-3 rounded-xl accent-gradient text-white font-semibold hover:opacity-90 text-center">
            Go to Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition min-h-screen flex items-center justify-center bg-[#f0f2f5]">
      <div className="flex flex-col items-center gap-4">
        <img src="/Logo.png" alt="SproutHR" className="h-20 w-auto animate-pulse" />
        <span className="text-sm text-gray-500">Completing sign in...</span>
      </div>
    </div>
  );
}
