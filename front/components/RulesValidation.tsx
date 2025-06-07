"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

interface RulesValidationProps {
  onNext: () => void;
  onBack: () => void;
}

const RulesValidation = ({ onNext, onBack }: RulesValidationProps) => {
  const [acceptedRules, setAcceptedRules] = useState<string[]>([]);

  const rules = [
    {
      id: "vehicle-condition",
      title: "État du véhicule",
      description: "J'accepte que mon véhicule soit inspecté avant et après le service"
    },
    {
      id: "insurance",
      title: "Assurance",
      description: "Je confirme que mon véhicule est assuré et en règle"
    },
    {
      id: "keys",
      title: "Remise des clés",
      description: "J'accepte de remettre les clés de mon véhicule au voiturier"
    },
    {
      id: "damage-report",
      title: "Rapport de dommages",
      description: "J'accepte le processus de signalement des dommages éventuels"
    },
    {
      id: "payment-terms",
      title: "Conditions de paiement",
      description: "J'ai lu et j'accepte les conditions de paiement"
    },
    {
      id: "cancellation",
      title: "Politique d'annulation",
      description: "Je comprends la politique d'annulation (24h avant le service)"
    },
    {
      id: "liability",
      title: "Responsabilité",
      description: "Je comprends les limites de responsabilité du service"
    },
    {
      id: "privacy",
      title: "Protection des données",
      description: "J'accepte la politique de confidentialité et le traitement de mes données"
    }
  ];

  const handleRuleToggle = (ruleId: string) => {
    setAcceptedRules(prev =>
      prev.includes(ruleId)
        ? prev.filter(id => id !== ruleId)
        : [...prev, ruleId]
    );
  };

  const allRulesAccepted = rules.length === acceptedRules.length;

  return (
    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-xl max-w-3xl w-full">
      <h2 className="text-2xl font-bold mb-6 text-navy">Validation des règles</h2>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-navy">Conditions générales du service</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Veuillez lire et accepter toutes les règles suivantes pour finaliser votre réservation.
          </p>

          <div className="space-y-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  acceptedRules.includes(rule.id)
                    ? 'border-gold bg-gold/5'
                    : 'border-gray-200 hover:border-gold'
                }`}
                onClick={() => handleRuleToggle(rule.id)}
              >
                <div
                  className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all ${
                    acceptedRules.includes(rule.id)
                      ? 'bg-gold border-gold'
                      : 'border-gray-300'
                  }`}
                >
                  {acceptedRules.includes(rule.id) && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </div>

                <div className="flex-1">
                  <h4 className="font-semibold text-navy mb-1">{rule.title}</h4>
                  <p className="text-sm text-gray-600">{rule.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Important :</strong> En acceptant ces conditions, vous confirmez avoir lu et compris
              toutes les règles du service. Ces conditions sont nécessaires pour garantir un service
              de qualité et la sécurité de votre véhicule.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack}>
          Retour
        </Button>

        <div className="text-center">
          <div className="text-sm text-gray-600 mb-2">
            {acceptedRules.length} / {rules.length} règles acceptées
          </div>
          <Button
            onClick={onNext}
            disabled={!allRulesAccepted}
            className="bg-gold hover:bg-gold-dark text-navy font-bold px-8"
          >
            {allRulesAccepted ? "Continuer vers le paiement" : "Accepter toutes les règles"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RulesValidation;
