import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import Cookies from "js-cookie";

const ServiceStatusDialogInline = ({
  devisId,
  services,
  serviceStatus: initialStatus,
  onStatusChange,
}: {
  devisId: number | string;
  services?: { name: string }[];
  serviceStatus?: boolean;
  onStatusChange?: (val: boolean) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [serviceStatus, setServiceStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  // Gère l'update
  const handleValidate = async () => {
    setLoading(true);
    setErrMsg("");
    try {
      const token = Cookies.get('token');
      const res = await fetch(`/api/admin/devis/${devisId}/validate-services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (!res.ok) throw new Error("Erreur lors de la validation.");
      setServiceStatus(true);
      if (onStatusChange) onStatusChange(true);
    } catch (err) {
      setErrMsg("Échec de la validation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          Voir services
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Services du devis</DialogTitle>
        </DialogHeader>

        <div className="mb-4 flex items-center gap-2">
          {serviceStatus ? (
            <Badge variant="default" className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Tous les services faits
            </Badge>
          ) : (
            <Badge variant="destructive" className="flex items-center gap-1">
              <XCircle className="h-4 w-4" /> Services à faire
            </Badge>
          )}
        </div>

        {services && services.length > 0 ? (
          <ul className="space-y-2 mb-4">
            {services.map((s, i) => (
              <li key={i}>{s.name}</li>
            ))}
          </ul>
        ) : (
          <div className="mb-4">Aucun service associé.</div>
        )}

        {!serviceStatus && (
          <Button
            variant="default"
            disabled={loading}
            onClick={handleValidate}
            className="w-full"
          >
            {loading ? "Validation..." : "Marquer tous les services comme faits"}
          </Button>
        )}

        {errMsg && <div className="text-red-600 text-sm mt-2">{errMsg}</div>}
      </DialogContent>
    </Dialog>
  );
};

export default ServiceStatusDialogInline;
