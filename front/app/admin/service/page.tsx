"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  included: string[];
}

const AdminServices = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    included: ""
  });
  const [loading, setLoading] = useState(true);

  // Fetch all services from API
  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/service");
      const data = await res.json();
      setServices(data);
    } catch {
      setServices([]);
      toast({ title: "Erreur", description: "Impossible de charger les services.", variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.description) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }
    // 1. included = array de string
    const includedArray = formData.included
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);

    // 2. price = nombre (0 = "Sur devis")
    const price = formData.price.trim().toLowerCase() === "sur devis"
      ? 0
      : Number(formData.price);

    if (isNaN(price)) {
      toast({
        title: "Erreur",
        description: "Le prix doit être un nombre ou 'Sur devis'.",
        variant: "destructive"
      });
      return;
    }

    const serviceData = {
      name: formData.name,
      description: formData.description,
      price,
      included: includedArray,
      active: true
    };

    try {
      if (editingService) {
        // PATCH (Edition)
        await fetch(`/api/admin/service/${editingService.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingService),
        });
        toast({ title: "Service modifié", description: "Le service a été modifié avec succès." });
      } else {
        // POST (Création)
        await fetch("/api/admin/service", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(serviceData)
        });
        toast({ title: "Service ajouté", description: "Le service a été ajouté avec succès." });
      }
      fetchServices();
      resetForm();
      setIsDialogOpen(false);
    } catch  {
      toast({ title: "Erreur", description: "Échec de l'opération.", variant: "destructive" });
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price === 0 ? "Sur devis" : service.price.toString(),
      included: service.included.join('\n')
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (serviceId: number) => {
    // Soft delete : active = false
    try {
      await fetch(`${process.env.BACKEND_URL}/service/${serviceId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      fetchServices();
      toast({
        title: "Service supprimé",
        description: "Le service a été supprimé avec succès."
      });
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le service.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", price: "", included: "" });
    setEditingService(null);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-navy">Gestion des Services</h1>
          <p className="text-gray-600">Gérez les services supplémentaires proposés aux clients</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-navy hover:bg-navy-light text-white">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Modifier le service" : "Ajouter un nouveau service"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom du service *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Ex: Nettoyage du véhicule"
                />
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Description du service"
                />
              </div>
              <div>
                <Label htmlFor="price">Prix</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="Ex: 35 ou Sur devis"
                />
              </div>
              <div>
                <Label htmlFor="included">Services inclus (un par ligne)</Label>
                <Textarea
                  id="included"
                  value={formData.included}
                  onChange={(e) => handleInputChange("included", e.target.value)}
                  placeholder="Service 1&#10;Service 2&#10;Service 3"
                  rows={4}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleDialogClose}>
                  Annuler
                </Button>
                <Button onClick={handleSubmit} className="bg-navy hover:bg-navy-light text-white">
                  {editingService ? "Modifier" : "Ajouter"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-navy">Services disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-gray-400">Chargement…</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Services inclus</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{service.description}</TableCell>
                    <TableCell>
                      {service.price === 0
                        ? <span className="italic text-gray-600">Sur devis</span>
                        : `${service.price}€`
                      }
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        {service.included.slice(0, 2).map((item, index) => (
                          <div key={index} className="text-sm text-gray-600">• {item}</div>
                        ))}
                        {service.included.length > 2 && (
                          <div className="text-sm text-gray-500">
                            +{service.included.length - 2} autres...
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(service)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(service.id)}
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

export default AdminServices;
