import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DataResponse} from './model/data-response.model';

export interface transfertData {
  idEmetteur: number,
  idRecepteur: number,
  montant: number,
  dateExecution?: Date
}

export interface transfertShed
{
  idEmetteur: number,
  idRecepteur: number,
  montant: number,
  jourDuMois: number,
  heure: number,
  minute: number,
  type: string
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly API_URL = 'http://localhost:3000';

  constructor( private readonly  http:HttpClient) { }


  getTransactionsbyprofile(): Observable<DataResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<DataResponse>(`${this.API_URL}/transaction/transactionsprofile`, { headers });
  }
  getTransfertbyprofile(): Observable<DataResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<DataResponse>(`${this.API_URL}/transfert/me`, { headers });
  }

  getProfile(): Observable<DataResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<DataResponse>(`${this.API_URL}/comptes/profile`, { headers });
  }


  transfert(data : transfertData){
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post<DataResponse>(`${this.API_URL}/transfert`, data, { headers });
  }


  transfertulterieur(data : transfertData) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post<DataResponse>(`${this.API_URL}/transfert/schedule`, data, { headers });
  }


  transfertProg(data:transfertShed) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post<DataResponse>(`${this.API_URL}/transfert-recurrent`, data, { headers });
  }


  getTransfertRecurrent() {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<DataResponse>(`${this.API_URL}/transfert-recurrent/mytransfers`, { headers });

  }
}
