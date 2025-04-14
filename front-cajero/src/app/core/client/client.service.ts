import { Injectable } from '@angular/core';
import { environment } from '../../../assets/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = `${environment.domain}`;
  private API_PATH = `/client/`;

  constructor(private http: HttpClient) {}

  getAllClients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}${this.API_PATH}`);
  }

  registerClient(clientData: {
    name: string;
    lastName: string;
    identification: string;
    email: string;
    phonenumber: string;
    address: string;
    referenceaddress: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}${this.API_PATH}register`, clientData);
  }

  updateClient(
    clientId: string,
    clientData: {
      name: string;
      lastName: string;
      identification: string;
      email: string;
      phonenumber: string;
      address: string;
      referenceaddress: string;
    }
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}${this.API_PATH}update/${clientId}`,
      clientData
    );
  }
  deleteClient(clientId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}${this.API_PATH}${clientId}`);
  }
}
