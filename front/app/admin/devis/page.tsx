"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Download, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import Cookies from "js-cookie";
import VolInfoDialog from "@/components/VolInfoDialog";
import ServiceStatusDialogInline from "@/components/ServiceStatusDialog";
import ParkingInfoDialog from "@/components/ParkingInfoDialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
  infosVol?: {
    numVol: string;
    terminal: string;
  } | null;
  services?: { name: string }[];
  serviceStatus?: boolean; // ton boolean global
  transport : {
    type : string;
  }
  infoParking?: string | null;
};

const STATUS_LABELS = {
  EN_ATTENTE: { text: "À Garer", color: "bg-blue-100 text-blue-800" },
  EN_COURS: { text: "À Rendre", color: "bg-red-100 text-red-800" },
  RESTITUE: { text: "Véhicule rendu", color: "bg-gray-100 text-gray-800" },
  REFUSE: { text: "Refusé", color: "bg-red-100 text-red-800" },
};

const AdminQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ACTIFS"); // Nouveau filtre pour EN_ATTENTE + EN_COURS
  const [priceFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [showCalendar, setShowCalendar] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | string | null>(null);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      // Si le filtre est "ACTIFS", on ne filtre pas par statut côté serveur
      // On récupère tous les devis et on filtre côté client
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
        search: searchTerm,
        price: priceFilter,
      });
      
      // Ajouter le filtre statut seulement si ce n'est pas "ACTIFS"
      if (statusFilter !== "ACTIFS") {
        params.append("statut", statusFilter);
      }
      
      const token = Cookies.get('token');
      const res = await fetch(`/api/admin/devis?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error("Erreur lors du chargement des devis");
      const data = await res.json();
      
      let filteredDevis = data.devis;
      
      // Si le filtre est "ACTIFS", filtrer côté client EN_ATTENTE + EN_COURS
      if (statusFilter === "ACTIFS") {
        filteredDevis = filteredDevis.filter((d: Quote) => 
          d.statut === "EN_ATTENTE" || d.statut === "EN_COURS"
        );
      }
      
      // Filtrer par date si une date est sélectionnée
      if (dateFilter) {
        filteredDevis = filteredDevis.filter((d: Quote) => {
          // Pour statut EN_ATTENTE (entry), on regarde dateDebut
          // Pour statut EN_COURS (return), on regarde dateFin
          const dateToCheck = d.statut === "EN_ATTENTE" 
            ? d.dateDebut 
            : d.dateFin;
          
          if (!dateToCheck) return false;
          
          const devisDate = parseISO(dateToCheck);
          const filterDate = dateFilter;
          
          // Comparer uniquement les dates (jour/mois/année)
          return (
            devisDate.getDate() === filterDate.getDate() &&
            devisDate.getMonth() === filterDate.getMonth() &&
            devisDate.getFullYear() === filterDate.getFullYear()
          );
        });
      }
      
      // Trier par date (la plus proche en premier)
      filteredDevis.sort((a: Quote, b: Quote) => {
        const dateA = a.statut === "EN_ATTENTE" ? a.dateDebut : a.dateFin;
        const dateB = b.statut === "EN_ATTENTE" ? b.dateDebut : b.dateFin;
        
        if (!dateA) return 1;
        if (!dateB) return -1;
        
        return new Date(dateA).getTime() - new Date(dateB).getTime();
      });
      
      setQuotes(filteredDevis);
      setTotal(filteredDevis.length);
      console.log("Fetched quotes:", filteredDevis); // Ligne de débogage
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
  }, [page, statusFilter, searchTerm, priceFilter, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // --- Fonction pour gérer le changement de statut ---
  const handleChangeStatus = async (quote: Quote) => {
    setActionLoading(quote.id);

    // Déterminer le nouveau statut selon le statut actuel
    let newStatus = "";
    if (quote.statut === "EN_ATTENTE") newStatus = "EN_COURS";
    else if (quote.statut === "EN_COURS") newStatus = "RESTITUE";
    else return; // Pas d'action pour les autres statuts

    try {
      const token = Cookies.get('token');
      const res = await fetch(`/api/admin/devis/${quote.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ statut: newStatus }),
      });

      if (!res.ok) throw new Error("Erreur lors du changement de statut");

      // Recharger les devis après le changement
      await fetchQuotes();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors du changement de statut");
    } finally {
      setActionLoading(null);
    }
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
            
            <Popover open={showCalendar} onOpenChange={setShowCalendar}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`justify-start text-left font-normal ${!dateFilter && "text-muted-foreground"}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFilter ? format(dateFilter, "dd/MM/yyyy", { locale: fr }) : "Filtrer par date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFilter}
                  onSelect={(date) => {
                    setDateFilter(date);
                    setShowCalendar(false);
                    setPage(1);
                  }}
                  initialFocus
                  locale={fr}
                />
                {dateFilter && (
                  <div className="p-3 border-t">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setDateFilter(undefined);
                        setShowCalendar(false);
                        setPage(1);
                      }}
                    >
                      Réinitialiser
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
            
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIFS">Véhicules actifs</SelectItem>
                {Object.entries(STATUS_LABELS).map(([key, { text }]) => (
                  <SelectItem key={key} value={key}>{text}</SelectItem>
                ))}
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
            <CardTitle className="flex items-center justify-between">
              <span>Liste des Devis ({total})</span>
              {dateFilter && (
                <span className="text-sm font-normal text-gray-600">
                  Filtrée pour le {format(dateFilter, "dd MMMM yyyy", { locale: fr })}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Transport</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Véhicule</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Infos vol</TableHead>
                  <TableHead>Parking</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotes.map((quote) => {
                  // Déterminer la couleur de fond selon le statut
                  const rowBgColor = 
                    quote.statut === "EN_ATTENTE" ? "bg-green-50" :
                    quote.statut === "EN_COURS" ? "bg-red-50" : "";
                  
                  return (
                    <TableRow key={quote.id} className={rowBgColor}>
                    <TableCell className="font-medium">{quote.id}</TableCell>
                    <TableCell>
                      <div>
                        {quote.transport && quote.transport.type ? (
                          quote.transport.type
                        ) : (
                          <span className="text-gray-400 italic">Aucun transport</span>
                        )}
                      </div>
                    </TableCell>
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
                      <div className="text-sm space-y-1">
                        <div className={quote.statut === "EN_ATTENTE" ? "font-semibold text-green-700" : ""}>
                          {quote.statut === "EN_ATTENTE" && "📍 "}
                          Arrivée: {quote.dateDebut
                            ? format(new Date(quote.dateDebut), "dd/MM/yyyy 'à' HH:mm", { locale: fr })
                            : "N/A"}
                        </div>
                        <div className={quote.statut === "EN_COURS" ? "font-semibold text-red-700" : ""}>
                          {quote.statut === "EN_COURS" && "📍 "}
                          Départ: {quote.dateFin
                            ? format(new Date(quote.dateFin), "dd/MM/yyyy 'à' HH:mm", { locale: fr })
                            : "N/A"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {quote.infosVol && quote.infosVol.numVol && quote.infosVol.terminal ? (
                        `${quote.infosVol.numVol} / ${quote.infosVol.terminal}`
                      ) : (
                        <VolInfoDialog devisId={quote.id} forceShowForm />
                      )}
                    </TableCell>
                    <TableCell>
                      <ParkingInfoDialog 
                        devisId={quote.id} 
                        existingInfo={quote.infoParking} 
                      />
                    </TableCell>
                    <TableCell>
                      {quote.services && quote.services.length > 0 ? (
                        <ServiceStatusDialogInline
                          devisId={quote.id}
                          services={quote.services}
                          serviceStatus={quote.serviceStatus}
                        />
                      ) : (
                        <span className="text-gray-400 italic">Aucun service</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {(quote.statut === "EN_ATTENTE" || quote.statut === "EN_COURS") && (
                        <Button
                          size="sm"
                          className={`${
                            quote.statut === "EN_ATTENTE"
                              ? "bg-orange-500 hover:bg-orange-600"
                              : "bg-green-600 hover:bg-green-700"
                          } text-white`}
                          disabled={actionLoading === quote.id}
                          onClick={() => handleChangeStatus(quote)}
                        >
                          {actionLoading === quote.id
                            ? "Traitement..."
                            : quote.statut === "EN_ATTENTE"
                            ? "MIT PARKING"
                            : "RENDU"}
                        </Button>
                      )}
                      {quote.statut === "RESTITUE" && (
                        <span className="text-gray-500 italic">Terminé</span>
                      )}
                      {quote.statut === "REFUSE" && (
                        <span className="text-red-500 italic">Refusé</span>
                      )}
                    </TableCell>
                  </TableRow>
                  );
                })}
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
