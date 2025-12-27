# PaymentForm - Fusion des lignes Parking + Transport

## Problème
Dans le récapitulatif Stripe, deux lignes distinctes s'affichaient :
1. "Gardiennage automobile - Parking sécurisé" (180€)
2. "Transport : VOITURIER" (100€)

Cela créait une confusion car le prix du transport est maintenant inclus dans le prix total du parking.

## Solution
Fusionner les deux lignes en une seule ligne avec le montant total et le type de transport dans le nom.

## Modifications effectuées

### Fichier : `/components/PaymentForm.tsx`

#### Avant :
```tsx
// Ligne 1 : Parking
lineItems.push({
  name: "Gardiennage automobile - Parking sécurisé",
  description: `Du 28/12/2025 au 04/01/2026`,
  amount: 180,
  quantity: 1,
});

// Ligne 2 : Transport
if (userInfo?.selectedTransport) {
  lineItems.push({
    name: `Transport : VOITURIER`,
    description: "Présentez-vous à l'agence...",
    amount: 100,
    quantity: 1,
  });
}
```

#### Après :
```tsx
// Ligne unique : Gardiennage + Transport
const transportType = userInfo?.selectedTransport?.type || "Non spécifié";
lineItems.push({
  name: `Gardiennage automobile + Transport (${transportType})`,
  description: `Du 28/12/2025 au 04/01/2026`,
  amount: totalAmount, // 280€ (déjà inclut tout)
  quantity: 1,
});
```

## Résultat dans Stripe

### Avant (2 lignes) :
```
Gardiennage automobile - Parking sécurisé
Du 28/12/2025 au 04/01/2026
180,00 €

Transport : VOITURIER
Présentez-vous à l'agence 15 minutes avant l'heure prévue.
100,00 €

Total: 280,00 €
```

### Après (1 ligne) :
```
Gardiennage automobile + Transport (VOITURIER)
Du 28/12/2025 au 04/01/2026
280,00 €

Total: 280,00 €
```

## Avantages

1. ✅ **Clarté** : Une seule ligne = un seul service global
2. ✅ **Simplicité** : Plus de confusion sur les montants
3. ✅ **Cohérence** : Le prix affiché correspond au prix total
4. ✅ **Information** : Le type de transport est mentionné dans le nom
5. ✅ **Moins de lignes** : Facture plus lisible

## Services supplémentaires

Les services supplémentaires continuent d'être affichés sur des lignes séparées :
```
Gardiennage automobile + Transport (VOITURIER)  280€
Lavage extérieur                                 15€
Contrôle technique                               50€
────────────────────────────────────────────────────
Total                                           345€
```

## Variables utilisées

- `totalAmount` : Montant total incluant parking + transport
- `transportType` : Type de transport sélectionné (VOITURIER, NAVETTE, etc.)
- `services` : Liste des services supplémentaires (restent sur lignes séparées)

## Impact sur le code

### Supprimé :
- ❌ La section "Ligne transport" avec condition `if (userInfo?.selectedTransport)`
- ❌ Variable `transportPrice` dans les lineItems (mais conservée ailleurs)

### Ajouté :
- ✅ Extraction de `transportType` 
- ✅ Nom de ligne unifié avec template string
- ✅ Commentaire "Ligne unique : Gardiennage automobile + Transport"

## Date de modification
27 décembre 2024

## Statut
✅ **Implémenté** - Le récapitulatif Stripe affiche maintenant une seule ligne pour parking + transport
