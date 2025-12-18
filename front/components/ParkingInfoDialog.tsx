/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ParkingCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Cookies from "js-cookie";

interface ParkingInfoDialogProps {
  devisId: number | string;
  existingInfo?: string | null;
}

const ParkingInfoDialog = ({ devisId, existingInfo = null }: ParkingInfoDialogProps) => {
  const [open, setOpen] = useState(false);
  const [parkingInfo, setParkingInfo] = useState(existingInfo || "");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    setSuccess(null);

    try {
      const token = Cookies.get('token');
      const res = await fetch(`/api/admin/devis/${devisId}/infoParking`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ infoParking: parkingInfo }),
      });

      if (!res.ok) throw new Error("Erreur lors de l'enregistrement des infos parking");

      setSuccess("Informations de parking enregistrées avec succès !");
      
      // Fermer le dialog après 1.5 secondes
      setTimeout(() => {
        setOpen(false);
        // Recharger la page pour voir les changements
        window.location.reload();
      }, 1500);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => {
      setOpen(o);
      setSuccess(null);
      setError(null);
      // Réinitialiser avec les infos existantes lors de l'ouverture
      if (o) {
        setParkingInfo(existingInfo || "");
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <ParkingCircle className="h-3 w-3" />
          {existingInfo ? "Modifier parking" : "Ajouter parking"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Informations de parking</DialogTitle>
        </DialogHeader>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Informations complémentaires
            </label>
            <Textarea
              placeholder="Ex: Place P12, Niveau 2, Zone A&#10;Code d'accès: 1234&#10;Instructions spéciales..."
              value={parkingInfo}
              onChange={(e) => setParkingInfo(e.target.value)}
              rows={6}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ajoutez toutes les informations utiles concernant le parking (emplacement, code, instructions, etc.)
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={creating}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={creating || !parkingInfo.trim()}
            >
              {creating ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>

        {existingInfo && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-gray-500 mb-2">Informations actuelles :</p>
            <div className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap">
              {existingInfo}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ParkingInfoDialog;
