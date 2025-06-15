"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { Car, Clock, CheckCircle } from "lucide-react";

type Booking = {
  id: string;
  clientName: string;
  licensePlate: string;
  carModel: string;
  status: "entry" | "return";
  date: string | Date;
  time: string;
};

const AdminCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fonction pour charger les réservations
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/devis/calendar`);
      if (!res.ok) throw new Error("Erreur lors du chargement des réservations");
      const data = await res.json();
      setBookings(
        data.map((b: Booking) => ({
          ...b,
          date: new Date(b.date),
        }))
      );
    } catch (err) {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => isSameDay(booking.date, date));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "entry":
        return (
          <Badge className="bg-orange-100 text-orange-800 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            À récupérer
          </Badge>
        );
      case "return":
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            À rendre
          </Badge>
        );
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getDaysWithBookings = () => {
    // Retourne tous les jours uniques qui ont des réservations
    const days = new Set(bookings.map(booking => format(booking.date, "yyyy-MM-dd")));
    return Array.from(days).map(day => new Date(day));
  };

  const selectedDateBookings = selectedDate ? getBookingsForDate(selectedDate) : [];

  // --- Fonction pour gérer le changement de statut ---
  const handleChangeStatus = async (booking: Booking) => {
    setActionLoading(booking.id);

    // Statut cible (n-1)
    let newStatus = "";
    if (booking.status === "entry") newStatus = "EN_COURS";
    else if (booking.status === "return") newStatus = "RESTITUE";
    else return;

    try {
      // id numérique à partir de booking.id (ex: "entry-12" → 12)
      const idNum = Number(booking.id.replace(/^\D+/, ""));
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/devis/${idNum}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: newStatus }),
      });
      // Refetch propre (sans reload la page)
      await fetchBookings();
    } catch (err) {
      alert("Erreur lors du changement de statut");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy mb-2">Planning des Véhicules</h1>
        <p className="text-gray-600">Visualisez les entrées et sorties de véhicules</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendrier */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Calendrier des Réservations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                hasBooking: getDaysWithBookings()
              }}
              modifiersStyles={{
                hasBooking: {
                  backgroundColor: '#FEF3C7',
                  fontWeight: 'bold'
                }
              }}
            />
            <div className="mt-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-200 rounded"></div>
                <span>Jours avec réservations</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Détails du jour sélectionné */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate ? format(selectedDate, "dd MMMM yyyy", { locale: fr }) : "Sélectionnez une date"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center text-gray-400 py-8">Chargement…</div>
            ) : selectedDateBookings.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Aucune réservation ce jour
              </p>
            ) : (
              <div className="space-y-3">
                {selectedDateBookings.map((booking) => (
                  <div key={booking.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-navy">{booking.licensePlate}</div>
                        <div className="text-sm text-gray-600">{booking.carModel}</div>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>{booking.clientName}</div>
                      <div>{booking.time}</div>
                    </div>
                    {/* Action bouton */}
                    {(booking.status === "entry" || booking.status === "return") && (
                      <Button
                        className={`mt-3 ${
                          booking.status === "entry"
                            ? "bg-orange-500 hover:bg-orange-600"
                            : "bg-green-600 hover:bg-green-700"
                        } text-white`}
                        disabled={actionLoading === booking.id}
                        onClick={() => handleChangeStatus(booking)}
                      >
                        {actionLoading === booking.id
                          ? "Traitement..."
                          : booking.status === "entry"
                          ? "Véhicule récupéré"
                          : "Véhicule rendu"}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Résumé du jour */}
      {selectedDateBookings.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Résumé de la journée</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {selectedDateBookings.filter(b => b.status === 'entry').length}
                </div>
                <div className="text-sm text-orange-600">Véhicules à récupérer</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {selectedDateBookings.filter(b => b.status === 'return').length}
                </div>
                <div className="text-sm text-green-600">Véhicules à rendre</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminCalendar;
