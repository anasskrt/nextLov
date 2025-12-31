"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, ChevronLeft, ChevronRight, Mail, Phone, Trash2, AlertCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import Cookies from "js-cookie";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PAGE_SIZE = 10;

type BookingAbandonment = {
  id: number;
  email: string;
  phone: string;
  firstName: string;
  lastName?: string;
  estimatedPrice?: number;
  departureDate?: string;
  returnDate?: string;
  currentStep: string;
  selectedServices?: string[];
  abandonedAt: string;
  createdAt: string;
};

const STEP_LABELS: Record<string, string> = {
  services: "Sélection services",
  userinfo: "Informations utilisateur",
  rules: "Validation règles",
  payment: "Paiement",
};

const AdminAbandons = () => {
  const [abandonments, setAbandonments] = useState<BookingAbandonment[]>([]);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchAbandonments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
        search: searchTerm,
      });

      const token = Cookies.get("token");
      const res = await fetch(`/api/admin/booking-abandonments?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!res.ok) throw new Error("Erreur lors du chargement des abandons");

      const data = await res.json();
      setAbandonments(data.abandonments || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Erreur:", error);
      setAbandonments([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbandonments();
  }, [page, searchTerm]);

  const handleDelete = async () => {
    if (!deleteId) return;

    setDeleteLoading(true);
    try {
      const token = Cookies.get("token");
      const res = await fetch(`/api/admin/booking-abandonments?id=${deleteId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!res.ok) throw new Error("Erreur lors de la suppression");

      // Rafraîchir la liste
      await fetchAbandonments();
      setDeleteId(null);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-orange-500" />
            Réservations Abandonnées
            <Badge variant="secondary" className="ml-2">
              {total}
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Liste des clients ayant commencé mais pas finalisé leur réservation
          </p>
        </CardHeader>
        <CardContent>
          {/* Barre de recherche */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par email, téléphone ou nom..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tableau */}
          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : abandonments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun abandon de réservation trouvé
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Prix estimé</TableHead>
                      <TableHead>Étape</TableHead>
                      <TableHead>Services</TableHead>
                      <TableHead>Abandonné le</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {abandonments.map((abandonment) => (
                      <TableRow key={abandonment.id}>
                        {/* Client */}
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {abandonment.firstName} {abandonment.lastName || ""}
                            </div>
                          </div>
                        </TableCell>

                        {/* Contact */}
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <a
                                href={`mailto:${abandonment.email}`}
                                className="text-blue-600 hover:underline"
                              >
                                {abandonment.email}
                              </a>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <a
                                href={`tel:${abandonment.phone}`}
                                className="text-blue-600 hover:underline"
                              >
                                {abandonment.phone}
                              </a>
                            </div>
                          </div>
                        </TableCell>

                        {/* Dates */}
                        <TableCell>
                          {abandonment.departureDate && abandonment.returnDate ? (
                            <div className="text-sm">
                              <div>
                                {format(parseISO(abandonment.departureDate), "dd MMM yyyy", {
                                  locale: fr,
                                })}
                              </div>
                              <div className="text-gray-500">
                                {format(parseISO(abandonment.returnDate), "dd MMM yyyy", {
                                  locale: fr,
                                })}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>

                        {/* Prix estimé */}
                        <TableCell>
                          {abandonment.estimatedPrice ? (
                            <span className="font-medium">
                              {abandonment.estimatedPrice.toFixed(2)} €
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>

                        {/* Étape */}
                        <TableCell>
                          <Badge variant="outline">
                            {STEP_LABELS[abandonment.currentStep] || abandonment.currentStep}
                          </Badge>
                        </TableCell>

                        {/* Services */}
                        <TableCell>
                          {abandonment.selectedServices && abandonment.selectedServices.length > 0 ? (
                            <div className="text-sm">
                              {abandonment.selectedServices.map((service, idx) => (
                                <div key={idx} className="text-gray-600">
                                  • {service}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>

                        {/* Abandonné le */}
                        <TableCell>
                          <div className="text-sm text-gray-600">
                            {format(parseISO(abandonment.abandonedAt), "dd/MM/yyyy HH:mm", {
                              locale: fr,
                            })}
                          </div>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(abandonment.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-600">
                    Page {page} sur {totalPages} ({total} résultats)
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Précédent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                    >
                      Suivant
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer cet abandon ?</DialogTitle>
            <DialogDescription>
              Cette action est irréversible. L'abandon sera définitivement supprimé de la base de
              données.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={deleteLoading}
            >
              Annuler
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLoading ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAbandons;
