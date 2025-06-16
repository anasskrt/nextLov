'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from "js-cookie";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [allowed, setAllowed] = useState<null | boolean>(null)

  useEffect(() => {
    // Récupère le token du cookie (exemple avec js-cookie ou un autre moyen)
    const token = Cookies.get('token');
    if (!token) {
      router.push('/connexion')
      return
    }

    // Vérifie le rôle
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/whoIAm`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.text())
      .then(role => {
        if (parseInt(role, 10) !== 1) {
          router.push('/')
        } else {
          setAllowed(true)
        }
      })
      .catch(() => {
        router.push('/connexion')
      })

    // eslint-disable-next-line
  }, [])

  if (allowed === null) return null // ou un loader si tu veux

  return <>{children}</>

}
