"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, BarChart3 } from "lucide-react";

const AdminPage = () => {
  const pathname = usePathname();
  const isRootAdmin = pathname === "/admin";

  const adminMenuItems = [
    {
      title: "Gestion des devis",
      description: "Voir et gérer tous les devis clients",
      icon: FileText,
      path: "/admin/devis",
      count: "24"
    },
    {
      title: "Gestion des utilisateurs",
      description: "Gérer les comptes clients",
      icon: Users,
      path: "/admin/user",
      count: "156"
    },
    {
      title: "Calendrier des réservations",
      description: "Voir le calendrier des réservations",
      icon: BarChart3,
      path: "/admin/calendrier",
      count: "---"
    },    
    {
      title: "Service supplémentaire",
      description: "Voir les services supplémentaires",
      icon: BarChart3,
      path: "/admin/service",
      count: "---"
    },
    {
      title: "Tarif journalier",
      description: "Gérer les tarifs journaliers",
      icon: BarChart3,
      path: "/admin/tarif",
      count: "---"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">Panel Administrateur</h1>
          <p className="text-gray-600">Gérez votre service de voiturier</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminMenuItems.map((item) => (
            <Card key={item.path} className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link href={item.path}>
                <div>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium text-navy">
                      {item.title}
                    </CardTitle>
                    <item.icon className="h-6 w-6 text-gold" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-navy">{item.count}</span>
                      <Button variant="outline" size="sm" className="text-navy border-navy hover:bg-navy hover:text-white">
                        Accéder
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
