"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Plus, Save, X } from "lucide-react";
import Cookies from "js-cookie";

interface Transport {
  id: number;
  type: string;
  prix: number;
  consignes?: string;
  actif: boolean;
}

const AdminTransports = () => {
  const [transports, setTransports] = useState<Transport[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Partial<Transport>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTransport, setNewTransport] = useState({
    type: "",
    prix: 0,
    consignes: ""
  });
  const { toast } = useToast();

  const transportTypes = [
    "NAVETTE",
    "VOITURIER",
  ];

  const fetchTransports = async () => {
    try {
      const response = await fetch('/api/transports');
      if (response.ok) {
        const data = await response.json();
        setTransports(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des transports:', error);
    }
  };

  useEffect(() => {
    fetchTransports();
  }, []);

  const handleEdit = (transport: Transport) => {
    setEditingId(transport.id);
    setEditValues({
      prix: transport.prix,
      consignes: transport.consignes,
      actif: transport.actif
    });
  };

  const handleSave = async (id: number) => {
    if (!editValues.prix || editValues.prix <= 0) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le prix doit être supérieur à 0",
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = Cookies.get('token');
      const response = await fetch(`/api/admin/transports/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),

        },
        body: JSON.stringify(editValues),
      });

      if (response.ok) {
        await fetchTransports();
        setEditingId(null);
        setEditValues({});
        toast({
          title: "Succès",
          description: "Transport mis à jour avec succès",
        });
      } else {
        throw new Error('Erreur lors de la mise à jour');
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de la mise à jour du transport",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleAddTransport = async () => {
    if (!newTransport.type || !newTransport.prix || newTransport.prix <= 0) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Type et prix sont requis et le prix doit être supérieur à 0",
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = Cookies.get('token');
      const response = await fetch('/api/admin/transports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(newTransport),
      });

      if (response.ok) {
        await fetchTransports();
        setNewTransport({ type: "", prix: 0, consignes: "" });
        setShowAddForm(false);
        toast({
          title: "Succès",
          description: "Transport ajouté avec succès",
        });
      } else {
        throw new Error('Erreur lors de la création');
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de l'ajout du transport",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTransportType = (type: string) => {
    switch (type) {
      case "NAVETTE":
        return "Navette";
      case "VOITURIER":
        return "voiturier";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">Gestion des Transports</h1>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-navy hover:bg-navy-dark text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un transport
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Ajouter un nouveau transport</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="new-type">Type de transport *</Label>
                <Select 
                  value={newTransport.type} 
                  onValueChange={(value) => setNewTransport({...newTransport, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {transportTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {formatTransportType(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="new-prix">Prix (€) *</Label>
                <Input
                  id="new-prix"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newTransport.prix}
                  onChange={(e) => setNewTransport({...newTransport, prix: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="new-consignes">Consignes</Label>
                <Input
                  id="new-consignes"
                  value={newTransport.consignes}
                  onChange={(e) => setNewTransport({...newTransport, consignes: e.target.value})}
                  placeholder="Consignes particulières..."
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button 
                onClick={handleAddTransport} 
                disabled={isLoading}
                className="bg-navy hover:bg-navy-dark text-white"
              >
                {isLoading ? "Ajout..." : "Ajouter"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAddForm(false);
                  setNewTransport({ type: "", prix: 0, consignes: "" });
                }}
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Liste des transports</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Prix (€)</TableHead>
                <TableHead>Consignes</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transports.map((transport) => (
                <TableRow key={transport.id}>
                  <TableCell>{formatTransportType(transport.type)}</TableCell>
                  <TableCell>
                    {editingId === transport.id ? (
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editValues.prix || 0}
                        onChange={(e) => setEditValues({...editValues, prix: parseFloat(e.target.value) || 0})}
                        className="w-24"
                      />
                    ) : (
                      `${transport.prix.toFixed(2)} €`
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === transport.id ? (
                      <Input
                        value={editValues.consignes || ""}
                        onChange={(e) => setEditValues({...editValues, consignes: e.target.value})}
                        placeholder="Consignes..."
                      />
                    ) : (
                      transport.consignes || "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === transport.id ? (
                      <Select 
                        value={editValues.actif ? "true" : "false"} 
                        onValueChange={(value) => setEditValues({...editValues, actif: value === "true"})}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Actif</SelectItem>
                          <SelectItem value="false">Inactif</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className={`px-2 py-1 rounded text-xs ${
                        transport.actif 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transport.actif ? 'Actif' : 'Inactif'}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === transport.id ? (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleSave(transport.id)}
                          disabled={isLoading}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={handleCancel}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEdit(transport)}
                        className="text-navy border-navy hover:bg-navy hover:text-white"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
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

export default AdminTransports;
