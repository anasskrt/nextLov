"use client"; // Important pour les app routers Next.js 13/14

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, UserCheck, UserX, Search, MoreHorizontal } from "lucide-react";

// Données mock pour démo
const mockUsers = [
  {
    id: 1,
    name: "Jean Dupont",
    email: "jean.dupont@email.com",
    phone: "06 12 34 56 78",
    registrationDate: "2024-01-15",
    totalBookings: 5,
    totalSpent: 850,
    status: "active",
    lastActivity: "2024-01-20"
  },
  {
    id: 2,
    name: "Marie Martin",
    email: "marie.martin@email.com",
    phone: "06 98 76 54 32",
    registrationDate: "2024-01-10",
    totalBookings: 12,
    totalSpent: 1200,
    status: "active",
    lastActivity: "2024-01-18"
  },
  {
    id: 3,
    name: "Pierre Durand",
    email: "pierre.durand@email.com",
    phone: "06 55 44 33 22",
    registrationDate: "2023-12-20",
    totalBookings: 3,
    totalSpent: 380,
    status: "inactive",
    lastActivity: "2023-12-25"
  },
  {
    id: 4,
    name: "Sophie Lefebvre",
    email: "sophie.lefebvre@email.com",
    phone: "06 11 22 33 44",
    registrationDate: "2024-01-05",
    totalBookings: 8,
    totalSpent: 920,
    status: "suspended",
    lastActivity: "2024-01-12"
  }
];

export default function AdminUsers() {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activityFilter, setActivityFilter] = useState("all");

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesActivity = activityFilter === "all" || 
      (activityFilter === "recent" && new Date(user.lastActivity) > new Date("2024-01-15")) ||
      (activityFilter === "old" && new Date(user.lastActivity) <= new Date("2024-01-15"));
    return matchesSearch && matchesStatus && matchesActivity;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactif</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspendu</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === "active").length;
  const newUsersThisMonth = users.filter(user => 
    new Date(user.registrationDate) >= new Date("2024-01-01")
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy mb-2">Gestion des Utilisateurs</h1>
        <p className="text-gray-600">Gérez vos clients et leurs informations</p>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux ce mois</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newUsersThisMonth}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
                <SelectItem value="suspended">Suspendu</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={activityFilter} onValueChange={setActivityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Activité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toute activité</SelectItem>
                <SelectItem value="recent">Activité récente</SelectItem>
                <SelectItem value="old">Activité ancienne</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Utilisateurs ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Date d'inscription</TableHead>
                <TableHead>Réservations</TableHead>
                <TableHead>Total dépensé</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernière activité</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{new Date(user.registrationDate).toLocaleDateString()}</TableCell>
                  <TableCell>{user.totalBookings}</TableCell>
                  <TableCell>{user.totalSpent}€</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{new Date(user.lastActivity).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucun utilisateur trouvé avec ces critères.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
