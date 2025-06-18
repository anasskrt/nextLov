"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Cookies from "js-cookie";

type Devis = {
  id: number;
  dateDebut: string;
  dateFin: string;
  montantFinal: number;
  estConverti: boolean;
  voiture: {
    plaque: string;
    marque: string;
    modele: string;
  };
};

const ProfilePage = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [devisList, setDevisList] = useState<Devis[]>([]);
  
  const token = Cookies.get('token');
    
  const router = useRouter();  useEffect(() => {
    if (!token) {
      router.push("/connexion");
      return;
    }

    fetch(`api/user/mon-espace`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Token invalide ou expiré");
        return res.json();
      })
      .then((data) => {
        const { utilisateur, devis } = data;
        setUserName(`${utilisateur.prenom} ${utilisateur.nom}`);
        setUserEmail(utilisateur.email);
        setDevisList(devis || []);
      })
      .catch(() => {
        toast.error("Session expirée. Veuillez vous reconnecter.");
        Cookies.remove('token');
        router.push("/connexion");
      });
  }, [router, token]);

  const handleLogout = () => {
    Cookies.remove('token');

    toast.success("Vous êtes déconnecté");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl">
          <h1 className="text-3xl font-bold mb-8 text-center">Mon Profil</h1>

          <div className="flex flex-col md:flex-row gap-6">
            <Card className="md:w-1/3">
              <CardHeader className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarFallback className="text-2xl bg-navy text-white">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{userName}</CardTitle>
                <CardDescription>{userEmail}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Button
                  variant="outline"
                  className="mb-2 w-full"
                  onClick={() => toast.info("Fonctionnalité à venir")}
                >
                  Modifier le profil
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleLogout}
                >
                  Se déconnecter
                </Button>
              </CardContent>
            </Card>

            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Mes devis</CardTitle>
                <CardDescription>
                  Liste de vos devis payés
                </CardDescription>
              </CardHeader>
              <CardContent>
                {devisList.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p>Aucun devis trouvé.</p>
                    <Button
                      className="mt-4 bg-navy hover:bg-navy-light"
                      onClick={() => router.push("/#devis")}
                    >
                      Demander un devis
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left border border-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2">#</th>
                          <th className="px-4 py-2">Voiture</th>
                          <th className="px-4 py-2">Dates</th>
                          <th className="px-4 py-2">Montant</th>
                          <th className="px-4 py-2">Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {devisList.map((devis, index) => (
                          <tr key={devis.id} className="border-t">
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2">
                              {devis.voiture.marque} {devis.voiture.modele} ({devis.voiture.plaque})
                            </td>
                            <td className="px-4 py-2">
                              {new Date(devis.dateDebut).toLocaleString("fr-FR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}<br />
                              <span className="mx-1">→</span>
                              {new Date(devis.dateFin).toLocaleString("fr-FR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>

                            <td className="px-4 py-2">{devis.montantFinal} €</td>
                            <td className="px-4 py-2">
                              {devis.estConverti ? "Converti en réservation" : "En attente"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
