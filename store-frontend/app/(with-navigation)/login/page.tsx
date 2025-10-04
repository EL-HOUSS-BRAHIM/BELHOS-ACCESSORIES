'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Erreur de connexion');
    }
  };

  return (
    <div className="bg-neutral-50">
      <div className="mx-auto grid max-w-5xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="space-y-8 text-black">
          <span className="inline-flex items-center rounded-full bg-black px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white">
            Espace privé
          </span>
          <h1 className="text-3xl font-semibold tracking-[0.2em] sm:text-4xl">
            Connectez-vous à votre univers Belhos
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-black/70 sm:text-base">
            Accédez à vos réservations, suivez vos commandes et retrouvez vos sélections favorites. Votre espace personnel vous permet de garder un lien privilégié avec notre maison.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
              <p className="text-[0.65rem] uppercase tracking-[0.3em] text-black/60">Programme clients</p>
              <p className="mt-3 text-lg font-semibold">Invitations privées</p>
              <p className="mt-2 text-xs text-black/60">Des rendez-vous exclusifs pour découvrir nos nouveautés.</p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
              <p className="text-[0.65rem] uppercase tracking-[0.3em] text-black/60">Suivi personnalisé</p>
              <p className="mt-3 text-lg font-semibold">Commandes & réservations</p>
              <p className="mt-2 text-xs text-black/60">Retrouvez l&apos;historique de vos pièces et vos demandes sur-mesure.</p>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-black/10 bg-white p-10 shadow-sm shadow-black/5">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-semibold tracking-[0.2em]">Connexion</h2>
              <p className="text-sm text-black/60">Indiquez votre email et votre mot de passe pour accéder à votre espace.</p>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-black/70">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-full border border-black/20 bg-white px-6 py-3 text-sm focus:border-black focus:outline-none"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-black/70">
                  Mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-full border border-black/20 bg-white px-6 py-3 text-sm focus:border-black focus:outline-none"
                  autoComplete="current-password"
                  required
                />
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-full bg-black px-6 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-black/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              >
                Se connecter
              </button>
            </form>

            <p className="text-center text-xs uppercase tracking-[0.3em] text-black/60">
              Pas encore de compte ?{' '}
              <Link href="/register" className="text-black transition hover:text-black/70">
                S&apos;inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
