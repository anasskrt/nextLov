import { jwtDecode } from 'jwt-decode';

/**
 * Interface pour le token JWT décodé
 */
export interface DecodedToken {
  sub: number;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

/**
 * Vérifie si un token JWT est valide (non expiré)
 */
export function isTokenValid(token: string): boolean {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const now = Date.now();
    const expiration = decoded.exp * 1000;
    
    return expiration > now;
  } catch (error) {
    console.error('[AUTH] Invalid token:', error);
    return false;
  }
}

/**
 * Vérifie si un token JWT appartient à un admin
 */
export function isAdminToken(token: string): boolean {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.role === 'ADMIN';
  } catch (error) {
    console.error('[AUTH] Invalid token:', error);
    return false;
  }
}

/**
 * Décode un token JWT et retourne les informations utilisateur
 * Retourne null si le token est invalide ou expiré
 */
export function decodeToken(token: string): DecodedToken | null {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    
    // Vérifier l'expiration
    if (!isTokenValid(token)) {
      return null;
    }
    
    return decoded;
  } catch (error) {
    console.error('[AUTH] Failed to decode token:', error);
    return null;
  }
}

/**
 * Vérifie si un token existe et est valide
 * Retourne le token décodé ou null
 */
export function verifyAuthToken(authHeader: string): DecodedToken | null {
  if (!authHeader) {
    return null;
  }
  
  const token = authHeader.replace('Bearer ', '');
  return decodeToken(token);
}

/**
 * Vérifie si un token existe, est valide ET appartient à un admin
 */
export function verifyAdminToken(authHeader: string): DecodedToken | null {
  const decoded = verifyAuthToken(authHeader);
  
  if (!decoded || decoded.role !== 'ADMIN') {
    return null;
  }
  
  return decoded;
}
