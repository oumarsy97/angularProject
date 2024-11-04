// src/app/services/alert.service.ts
import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  // Méthode générique pour afficher des alertes
  show(
    type: SweetAlertIcon,
    title: string,
    text: string,
    confirmButtonText: string = 'OK'
  ) {
    return Swal.fire({
      icon: type,
      title: title,
      text: text,
      confirmButtonText: confirmButtonText,
      confirmButtonColor: this.getButtonColor(type)
    });
  }

  // Méthode de succès rapide
  success(
    title: string = 'Succès',
    text: string = 'Opération réussie',
    confirmButtonText: string = 'OK'
  ) {
    return this.show('success', title, text, confirmButtonText);
  }

  // Méthode d'erreur rapide
  error(
    title: string = 'Erreur',
    text: string = 'Une erreur est survenue',
    confirmButtonText: string = 'Fermer'
  ) {
    return this.show('error', title, text, confirmButtonText);
  }

  // Méthode de confirmation
  confirm(
    title: string,
    text: string,
    confirmButtonText: string = 'Confirmer',
    cancelButtonText: string = 'Annuler'
  ) {
    return Swal.fire({
      icon: 'question',
      title: title,
      text: text,
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545'
    });
  }

  // Méthode privée pour obtenir la couleur du bouton
  private getButtonColor(type: SweetAlertIcon): string {
    switch (type) {
      case 'success': return '#28a745';
      case 'error': return '#dc3545';
      case 'warning': return '#ffc107';
      case 'info': return '#17a2b8';
      default: return '#3085d6';
    }
  }
}
