import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { DataResponse } from './model/data-response.model';
import {firstValueFrom, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private readonly API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  login(telephone: string, code: string): Observable<DataResponse> {
    return this.http.post<DataResponse>(`${this.API_URL}/auth/login`, { telephone, code });
  }


  fetchTelephoneFromToken() : Observable<DataResponse> {
    const token = localStorage.getItem('access_token');
      return this.http.post<DataResponse>(`${this.API_URL}/comptes/token`, { token });

  }

  //validateCode
  validateCode(idcompte:number,code: string): Observable<DataResponse> {
    return this.http.get<DataResponse>(`${this.API_URL}/codes/validate/${idcompte}/${code}`);
  }

    resendCode(telephone: string, idCompte: number) {
    return this.http.post<DataResponse>(`${this.API_URL}/codes/resend`, { telephone, idCompte });

  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  //getProfile
  getProfile(): Observable<DataResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<DataResponse>(`${this.API_URL}/comptes/profile`, { headers });
  }



  getContacts() {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<DataResponse>(`${this.API_URL}/comptes/others`, { headers });

  }

  async logout(): Promise<void> {
    try {
      // Appel à votre API de déconnexion
     // await firstValueFrom(this.http.post(`${this.API_URL}/auth/logout`, {}));
      // Nettoyage des tokens si nécessaire
      this.clearTokens();

    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  }

  private clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}
