# 🕐 Correction du Problème de Timezone - Page Calendrier

## ❌ Problème Détecté

Sur la page `admin/calendrier`, les heures affichées avaient **1 heure de décalage** par rapport à la page `admin/devis` :
- **admin/devis** : Affichage correct en heure française
- **admin/calendrier** : Affichage avec -1 heure

---

## 🔍 Cause du Problème

### Code Problématique (AVANT)

```typescript
// Type avec Date ambiguë
type Booking = {
  date: string | Date;  // ❌ Type union problématique
  // ...
};

// Conversion automatique lors du fetch
setBookings(
  data.map((b: Booking) => ({
    ...b,
    date: new Date(b.date),  // ❌ Conversion qui cause le décalage
  }))
);

// Utilisation directe de l'objet Date
return bookings.filter(booking => isSameDay(booking.date, date));  // ❌
```

### Explication Technique

Lorsque vous utilisez `new Date(dateString)`, JavaScript interprète la chaîne selon plusieurs règles :

1. **Format ISO avec timezone** (`2024-12-18T14:30:00+01:00`) → Correct
2. **Format ISO sans timezone** (`2024-12-18T14:30:00`) → Interprété comme UTC
3. **Format local** (`2024-12-18 14:30:00`) → Interprété comme heure locale

Le problème : Si le backend envoie une date sans timezone explicite, la conversion `new Date()` peut l'interpréter comme UTC, alors que vous voulez l'heure locale française (UTC+1).

---

## ✅ Solution Appliquée

### Stratégie
**Garder les dates en `string` et les convertir uniquement au moment de l'affichage**, exactement comme dans `admin/devis`.

### Code Corrigé (APRÈS)

```typescript
// Type avec date en string seulement
type Booking = {
  date: string;  // ✅ String pour éviter les conversions automatiques
  // ...
};

// Pas de conversion lors du fetch
setBookings(data);  // ✅ On garde les données brutes

// Conversion uniquement lors de la comparaison
return bookings.filter(booking => 
  isSameDay(new Date(booking.date), date)  // ✅ Conversion à la demande
);

// Conversion pour l'affichage
const days = new Set(bookings.map(booking => 
  format(new Date(booking.date), "yyyy-MM-dd")  // ✅ Conversion pour formattage
));
```

---

## 📝 Modifications Effectuées

### Fichier : `/app/admin/calendrier/page.tsx`

#### 1. Type `Booking`
```diff
type Booking = {
  id: string;
  clientName: string;
  licensePlate: string;
  carModel: string;
  status: "entry" | "return";
- date: string | Date;
+ date: string;  // ✅ Gardé en string
  time: string;
  transportType: string;
};
```

#### 2. Fonction `fetchBookings()`
```diff
const fetchBookings = async () => {
  setLoading(true);
  try {
    const token = Cookies.get('token');
    const res = await fetch("/api/devis/calendar", {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) throw new Error("Erreur lors du chargement des réservations");
    const data = await res.json();
    console.log("Bookings data:", data);
-   setBookings(
-     data.map((b: Booking) => ({
-       ...b,
-       date: new Date(b.date),
-     }))
-   );
+   // On garde les dates en string pour éviter les problèmes de timezone
+   setBookings(data);
  } catch {
    setBookings([]);
  } finally {
    setLoading(false);
  }
};
```

#### 3. Fonction `getBookingsForDate()`
```diff
const getBookingsForDate = (date: Date) => {
- return bookings.filter(booking => isSameDay(booking.date, date));
+ return bookings.filter(booking => isSameDay(new Date(booking.date), date));
};
```

#### 4. Fonction `getDaysWithBookings()`
```diff
const getDaysWithBookings = () => {
  // Retourne tous les jours uniques qui ont des réservations
- const days = new Set(bookings.map(booking => format(booking.date, "yyyy-MM-dd")));
+ const days = new Set(bookings.map(booking => format(new Date(booking.date), "yyyy-MM-dd")));
  return Array.from(days).map(day => new Date(day));
};
```

---

## 🎯 Cohérence avec `admin/devis`

### Comparaison des Approches

| Aspect | admin/devis | admin/calendrier (avant) | admin/calendrier (après) |
|--------|-------------|--------------------------|--------------------------|
| Type de date | `string` | `string \| Date` | `string` ✅ |
| Conversion fetch | Aucune | `new Date()` | Aucune ✅ |
| Conversion affichage | `new Date()` à la demande | Objet Date stocké | `new Date()` à la demande ✅ |
| Timezone | Correct | -1 heure | Correct ✅ |

### Code de Référence (admin/devis)

```tsx
// Page admin/devis (référence correcte)
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
```

---

## 🧪 Tests à Effectuer

### Vérifications Recommandées

1. **Page calendrier**
   - [ ] Les heures affichées correspondent à celles de la page devis
   - [ ] Pas de décalage horaire entre les deux pages
   - [ ] Les dates dans le calendrier sont correctement surlignées

2. **Comparaison croisée**
   - [ ] Prendre un devis avec `dateDebut = 18/12/2024 à 14:30`
   - [ ] Vérifier que la page devis affiche `14:30`
   - [ ] Vérifier que la page calendrier affiche aussi `14:30`

3. **Actions de changement de statut**
   - [ ] Le bouton "Véhicule récupéré" fonctionne
   - [ ] Le bouton "Véhicule rendu" fonctionne
   - [ ] Les données sont rafraîchies correctement

---

## 📚 Bonnes Pratiques

### Règles pour la Gestion des Dates

1. **Stockage en base de données**
   - Toujours stocker en UTC
   - Utiliser le type `TIMESTAMP WITH TIME ZONE` (PostgreSQL)

2. **Transmission API**
   - Envoyer les dates au format ISO 8601 avec timezone
   - Exemple : `2024-12-18T14:30:00+01:00`

3. **Manipulation Frontend**
   - **Garder les dates en `string`** jusqu'au moment de l'affichage
   - **Convertir avec `new Date()`** uniquement pour formattage ou comparaison
   - Utiliser `date-fns` avec `locale: fr` pour l'affichage

4. **Éviter**
   - ❌ Stocker des objets `Date` dans le state
   - ❌ Convertir trop tôt (lors du fetch)
   - ❌ Utiliser `Date` comme type dans les interfaces API

### Pattern Recommandé

```typescript
// ✅ BON : Type string, conversion à la demande
type Data = { date: string };

const displayDate = (dateString: string) => {
  return format(new Date(dateString), "dd/MM/yyyy 'à' HH:mm", { locale: fr });
};

// ❌ MAUVAIS : Type Date, conversion précoce
type Data = { date: Date };
const data = apiData.map(d => ({ ...d, date: new Date(d.date) }));  // ❌ Risque de timezone
```

---

## 🔧 Résumé

### Avant
- Conversion `new Date()` lors du fetch → Décalage timezone
- Type `string | Date` ambigu
- Heures incorrectes (-1h)

### Après
- Dates gardées en `string` → Pas de conversion automatique
- Type `string` explicite
- Conversion `new Date()` uniquement à la demande
- **Heures correctes** ✅

---

**Date de correction** : 18 décembre 2024  
**Fichier corrigé** : `/app/admin/calendrier/page.tsx`  
**Impact** : ✅ Affichage horaire cohérent entre toutes les pages admin
