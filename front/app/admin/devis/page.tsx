"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Cookies from "js-cookie";

const PAGE_SIZE = 10;

type Quote = {
  id: number | string;
  utilisateur: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
  };
  voiture?: {
    marque?: string;
    modele?: string;
    plaque?: string;
  };
  dateDebut?: string;
  dateFin?: string;
  montantFinal?: number;
  statut?: string;
};

const STATUS_LABELS = {
  EN_ATTENTE: { text: "Attente véhicule", color: "bg-blue-100 text-blue-800" },
  EN_COURS: { text: "Véhicule reçu", color: "bg-red-100 text-red-800" },
  RESTITUE: { text: "Véhicule rendu", color: "bg-gray-100 text-gray-800" },
  REFUSE: { text: "Refusé", color: "bg-red-100 text-red-800" },
};

const AdminQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("EN_ATTENTE");
  const [priceFilter, setPriceFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
        statut: statusFilter,
        search: searchTerm,
        price: priceFilter,
      });
      const token = Cookies.get('token');
      const res = await fetch(`/api/admin/devis?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error("Erreur lors du chargement des devis");
      const data = await res.json();
      setQuotes(data.devis);
      setTotal(data.total);
    } catch {
      setQuotes([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
    // eslint-disable-next-line
  }, [page, statusFilter, searchTerm, priceFilter]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const getStatusBadge = (status: string | undefined) => {
    const s = STATUS_LABELS[status as keyof typeof STATUS_LABELS];
    if (!s) return <Badge variant="outline">Inconnu</Badge>;
    return <Badge className={s.color}>{s.text}</Badge>;
  };

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
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_LABELS).map(([key, { text }]) => (
                  <SelectItem key={key} value={key}>{text}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priceFilter} onValueChange={(v) => { setPriceFilter(v); setPage(1); }}>
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
      {/* Tableau paginé */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Chargement des devis…</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              Liste des Devis ({total}) – page {page} / {totalPages}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Véhicule</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell className="font-medium">{quote.id}</TableCell>
                    <TableCell>
                      {quote.utilisateur.nom} {quote.utilisateur.prenom}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{quote.utilisateur.email}</div>
                        <div className="text-gray-500">{quote.utilisateur.telephone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {quote.voiture
                        ? `${quote.voiture.marque || ""} ${quote.voiture.modele || ""} (${quote.voiture.plaque || ""})`
                        : ""}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>
                          Du: {quote.dateDebut
                            ? format(new Date(quote.dateDebut), "dd/MM/yyyy 'à' HH:mm", { locale: fr })
                            : ""}
                        </div>
                        <div>
                          Au: {quote.dateFin
                            ? format(new Date(quote.dateFin), "dd/MM/yyyy 'à' HH:mm", { locale: fr })
                            : ""}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">{Number(quote.montantFinal || 0)}€</TableCell>
                    <TableCell>{getStatusBadge(quote.statut)}</TableCell>
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
            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" /> Précédent
              </Button>
              <span>
                Page {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1"
              >
                Suivant <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminQuotes;
