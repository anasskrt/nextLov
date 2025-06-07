"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Eye } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Données fictives pour les devis
const mockQuotes = [
  {
    id: "Q001",
    clientName: "Jean Dupont",
    email: "jean.dupont@email.com",
    phone: "06 12 34 56 78",
    location: "Aéroport Charles de Gaulle",
    departureDate: new Date("2024-02-15"),
    returnDate: new Date("2024-02-20"),
    carModel: "BMW X5",
    price: 125,
    status: "confirmed",
    createdAt: new Date("2024-01-20")
  },
  {
    id: "Q002",
    clientName: "Marie Martin",
    email: "marie.martin@email.com",
    phone: "06 98 76 54 32",
    location: "Gare Montparnasse",
    departureDate: new Date("2024-02-18"),
    returnDate: new Date("2024-02-22"),
    carModel: "Audi A4",
    price: 100,
    status: "pending",
    createdAt: new Date("2024-01-22")
  },
  {
    id: "Q003",
    clientName: "Pierre Durand",
    email: "pierre.durand@email.com",
    phone: "06 11 22 33 44",
    location: "Aéroport Orly",
    departureDate: new Date("2024-02-25"),
    returnDate: new Date("2024-03-05"),
    carModel: "Mercedes C-Class",
    price: 250,
    status: "completed",
    createdAt: new Date("2024-01-25")
  }
];

const AdminQuotes = () => {
  const [quotes] = useState(mockQuotes);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmé</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Terminé</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = 
      quote.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || quote.status === statusFilter;
    
    const matchesPrice = 
      priceFilter === "all" ||
      (priceFilter === "low" && quote.price < 100) ||
      (priceFilter === "medium" && quote.price >= 100 && quote.price < 200) ||
      (priceFilter === "high" && quote.price >= 200);

    return matchesSearch && matchesStatus && matchesPrice;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy mb-2">Gestion des Devis</h1>
        <p className="text-gray-600">Consultez et gérez tous les devis clients</p>
      </div>

      {/* Filtres */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom, email, ID..."
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
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="confirmed">Confirmé</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Prix" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les prix</SelectItem>
                <SelectItem value="low">Moins de 100€</SelectItem>
                <SelectItem value="medium">100€ - 200€</SelectItem>
                <SelectItem value="high">Plus de 200€</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exporter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des devis */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Devis ({filteredQuotes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Lieu</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Véhicule</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium">{quote.id}</TableCell>
                  <TableCell>{quote.clientName}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{quote.email}</div>
                      <div className="text-gray-500">{quote.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{quote.location}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Du: {format(quote.departureDate, "dd/MM/yyyy", { locale: fr })}</div>
                      <div>Au: {format(quote.returnDate, "dd/MM/yyyy", { locale: fr })}</div>
                    </div>
                  </TableCell>
                  <TableCell>{quote.carModel}</TableCell>
                  <TableCell className="font-semibold">{quote.price}€</TableCell>
                  <TableCell>{getStatusBadge(quote.status)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      Voir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminQuotes;