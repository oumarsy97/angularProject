// src/types/transaction.interface.ts
export interface Transaction {
  id: string;
  type: 'Réception' | 'Envoi' | 'Paiement';
  montant: number;
  date: Date;
  destinataire?: string;
  status: 'success' | 'pending' | 'failed';
  category?: string;
  note?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phoneNumber: string;
  preferredLanguage: 'fr' | 'en';
  notificationsEnabled: boolean;
}

export interface Action {
  name: string;
  icon: string;
  gradient: string;
  route: string;
}
