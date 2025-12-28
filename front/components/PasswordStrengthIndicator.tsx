import React from 'react';
import { Progress } from '@/components/ui/progress';

interface PasswordStrengthIndicatorProps {
  password: string;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

const getPasswordStrength = (password: string): PasswordStrength => {
  let score = 0;
  
  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 15;
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^A-Za-z0-9]/.test(password)) score += 20;

  if (score < 30) {
    return { score, label: 'Faible', color: 'bg-red-500' };
  } else if (score < 60) {
    return { score, label: 'Moyen', color: 'bg-yellow-500' };
  } else if (score < 90) {
    return { score, label: 'Bon', color: 'bg-primary-red-500' };
  } else {
    return { score, label: 'Excellent', color: 'bg-green-500' };
  }
};

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  if (!password) return null;

  const strength = getPasswordStrength(password);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">Force du mot de passe :</span>
        <span className={`font-medium ${
          strength.score < 30 ? 'text-red-600' :
          strength.score < 60 ? 'text-yellow-600' :
          strength.score < 90 ? 'text-primary-red-600' : 'text-green-600'
        }`}>
          {strength.label}
        </span>
      </div>
      <Progress value={strength.score} className="h-2" />
      <div className="text-xs text-gray-500 space-y-1">
        <p>Le mot de passe doit contenir :</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li className={password.length >= 8 ? 'text-green-600' : 'text-gray-400'}>
            Au moins 8 caractères
          </li>
          <li className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-400'}>
            Une majuscule
          </li>
          <li className={/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-400'}>
            Une minuscule
          </li>
          <li className={/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-400'}>
            Un chiffre
          </li>
          <li className={/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : 'text-gray-400'}>
            Un caractère spécial
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;