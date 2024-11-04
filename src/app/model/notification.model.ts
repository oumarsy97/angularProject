export enum TypeNotification {
  TRANSACTION = 'TRANSACTION',
  SECURITE = 'SECURITE',
  COMPTE = 'COMPTE',
  PROMOTION = 'PROMOTION'
}

export interface Notificat {
  id: number;
  clientId: number;
  titre: string;
  message: string;
  type: TypeNotification;
  estLue: boolean;
  createdAt: Date;
}
