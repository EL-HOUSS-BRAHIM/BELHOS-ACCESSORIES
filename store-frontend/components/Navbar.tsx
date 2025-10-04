'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            BELHOS ACCESSORIES
          </Link>

          <div className="flex space-x-6 items-center">
            <Link href="/" className="hover:text-gray-300">
              Accueil
            </Link>
            <Link href="/boutique" className="hover:text-gray-300">
              Boutique
            </Link>
            <Link href="/reservations" className="hover:text-gray-300">
              Réservations
            </Link>
            <Link href="/contact" className="hover:text-gray-300">
              Contact
            </Link>

            {user ? (
              <>
                {isAdmin && (
                  <Link href="/admin" className="hover:text-gray-300 bg-red-600 px-3 py-1 rounded">
                    Admin
                  </Link>
                )}
                <span className="text-sm">Bonjour, {user.name}</span>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-gray-300">
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
                >
                  S&apos;inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
