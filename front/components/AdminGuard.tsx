'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from "js-cookie";
import { Loader2 } from 'lucide-react';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [allowed, setAllowed] = useState<null | boolean>(null)

  useEffect(() => {
    const token = Cookies.get('token');
    
    // ✅ Vérifier qu'un token existe
    if (!token) {
      router.push('/connexion')
      return
    }

    // Vérifie le rôle auprès du backend
    fetch("/api/auth/whoIAm", {
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Unauthorized')
        }
        return res.text()
      })
      .then(role => {
        if (parseInt(role, 10) !== 1) {
          router.push('/')
        } else {
          setAllowed(true)
        }
      })
      .catch((error) => {
        console.error('[ADMIN GUARD] Error verifying admin:', error)
        Cookies.remove('token')
        router.push('/connexion')
      })
  }, [router])

  // Afficher un loader tant que la vérification n'est pas terminée
  if (allowed === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <Loader2 className="animate-spin w-12 h-12 text-navy mb-4" />
        <p className="text-gray-600">Vérification des permissions...</p>
      </div>
    )
  }

  // Si pas autorisé, ne rien afficher (redirection en cours)
  if (!allowed) {
    return null
  }

  // Utilisateur autorisé, afficher le contenu
  return <>{children}</>
}