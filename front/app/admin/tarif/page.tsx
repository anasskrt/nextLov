"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

interface Tarif {
  id: number;
  prixJournalier: number;
  actif: boolean;
  createdAt: string;
  updatedAt: string;
}

const AdminPricing = () => {
  const { toast } = useToast();
  const [tarifs, setTarifs] = useState<Tarif[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTarif, setEditingTarif] = useState<Tarif | null>(null);
  const [formData, setFormData] = useState({
    prixJournalier: "",
    actif: true
  });
  const [loading, setLoading] = useState(true);

  // 1. Fetch all tarifs from API
  const fetchTarifs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tarif");
      const data = await res.json();
      setTarifs(data);
    } catch {
      setTarifs([]);
      toast({
        title: "Erreur",
        description: "Impossible de charger les tarifs.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTarifs();
    // eslint-disable-next-line
  }, []);

  // 2. Form handlers
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.prixJournalier) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir le prix journalier.",
        variant: "destructive"
      });
      return;
    }

    const price = parseFloat(formData.prixJournalier);

    if (isNaN(price) || price <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un prix valide.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingTarif) {
        // Si tu veux gérer la modification : PATCH à faire ici (pas géré dans ton back actuel)
        // (À ajouter dans le back : endpoint PATCH sur /tarif/:id)
        await fetch(`/api/tarif?id=${editingTarif.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prixJournalier: price,
            actif: formData.actif,
          })
        });
        toast({
          title: "Tarif modifié",
          description: "Le tarif a été modifié avec succès."
        });
      } else {
        // Création d’un nouveau tarif
        await fetch("/api/tarif", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prixJournalier: price,
            actif: formData.actif,
          })
        });
        toast({
          title: "Tarif ajouté",
          description: "Le nouveau tarif a été ajouté avec succès."
        });
      }
      fetchTarifs();
      resetForm();
      setIsDialogOpen(false);
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible d’ajouter le tarif.",
        variant: "destructive"
      });
    }
  };

  // 3. Delete un tarif
  const handleDelete = async (tarifId: number) => {
    try {
      await fetch(`${process.env.BACKEND_URL}/tarif/${tarifId}`, {
        method: "DELETE"
      });
      fetchTarifs();
      toast({
        title: "Tarif supprimé",
        description: "Le tarif a été supprimé avec succès."
      });
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le tarif.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      prixJournalier: "",
      actif: true
    });
    setEditingTarif(null);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-navy">Gestion des Prix Journaliers</h1>
          <p className="text-gray-600">Gérez les différents tarifs de stationnement proposés aux clients</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-navy hover:bg-navy-light text-white">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un tarif
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingTarif ? "Modifier le tarif" : "Ajouter un nouveau tarif"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="prixJournalier">Prix journalier (€) *</Label>
                <Input
                  id="prixJournalier"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.prixJournalier}
                  onChange={(e) => handleInputChange("prixJournalier", e.target.value)}
                  placeholder="35.00"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="actif"
                  checked={formData.actif}
                  onCheckedChange={(checked) => handleInputChange("actif", checked as boolean)}
                />
                <Label htmlFor="actif">Tarif actif</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleDialogClose}>
                  Annuler
                </Button>
                <Button onClick={handleSubmit} className="bg-navy hover:bg-navy-light text-white">
                  {editingTarif ? "Modifier" : "Ajouter"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-navy">Tarifs disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-400">Chargement…</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Prix journalier</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Créé le</TableHead>
                  <TableHead>Modifié le</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tarifs.map((tarif) => (
                  <TableRow key={tarif.id}>
                    <TableCell className="font-medium">{tarif.id}</TableCell>
                    <TableCell className="font-bold text-navy">{tarif.prixJournalier.toFixed(2)}€</TableCell>
                    <TableCell>
                      {tarif.actif ? (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Actif
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                          Inactif
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(tarif.createdAt)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(tarif.updatedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {/* 
                          Si tu veux activer l’édition : handleEdit(tarif)
                          Pour l’instant, le PATCH n’est pas géré dans ton back donc je ne l’active pas
                        */}
                        {/* <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(tarif)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button> */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(tarif.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPricing;
