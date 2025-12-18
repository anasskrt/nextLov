/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Input } from "@/components/ui/input";

interface VolInfoDialogProps {
  devisId: number | string;
  forceShowForm?: boolean;
}

const VolInfoDialog = ({ devisId, forceShowForm = false }: VolInfoDialogProps) => {
  const [open, setOpen] = useState(false);
  const [vols, setVols] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(forceShowForm);
  const [numVol, setNumVol] = useState("");
  const [terminal, setTerminal] = useState("");
  const [creating, setCreating] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchVols = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/devis/${devisId}`);
      if (!res.ok) throw new Error("Erreur lors du chargement des infos vol");
      const data = await res.json();
      
      // Si data contient infosVol, l'utiliser, sinon tableau vide
      if (data && data.infosVol) {
        setVols([data.infosVol]);
      } else {
        setVols([]);
      }
    } catch (e: any) {
      setError(e.message || "Erreur lors du chargement des infos vol");
      setVols([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVol = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/admin/devis/${devisId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numVol, terminal }),
      });
      if (!res.ok) throw new Error("Erreur lors de la création du vol");
      setNumVol("");
      setTerminal("");
      setShowForm(false);
      setSuccess("Vol créé avec succès");
      fetchVols();
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
      if (o) fetchVols();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Eye className="h-3 w-3" />
          Infos vol
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Informations du vol</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div>Chargement…</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <>
            {vols.length === 0 ? (
              <div className="mb-4 text-gray-500">Aucune information de vol disponible.</div>
            ) : (
              <ul className="space-y-2 mb-4">
                {vols.map((vol, idx) => (
                  <li key={idx} className="border rounded p-2">
                    <div><b>Numéro de vol:</b> {vol.numVol || "-"}</div>
                    <div><b>Terminal:</b> {vol.terminal || "-"}</div>
                  </li>
                ))}
              </ul>
            )}
            {success && <div className="text-green-600 mb-2">{success}</div>}
            {showForm ? (
              <form onSubmit={handleCreateVol} className="space-y-3 mb-2">
                <Input
                  placeholder="Numéro de vol"
                  value={numVol}
                  onChange={e => setNumVol(e.target.value)}
                  required
                />
                <Input
                  placeholder="Terminal"
                  value={terminal}
                  onChange={e => setTerminal(e.target.value)}
                  required
                />
                <div className="flex gap-2">
                  <Button type="submit" disabled={creating}>
                    {creating ? "Création..." : "Créer le vol"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Annuler
                  </Button>
                </div>
              </form>
            ) : (
              <Button variant="secondary" onClick={() => setShowForm(true)}>
                Ajouter un vol
              </Button>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VolInfoDialog;
