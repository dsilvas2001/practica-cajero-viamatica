import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../assets/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TurnService {
  private apiUrl = `${environment.domain}`;
  private API_PATH = `/turn/`;
  private API_PATH_CASH = `/cash/`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  createTurn(description: string, cashId: string): Observable<any> {
    const gestorId = this.authService.getUserInfo().id;

    const body = {
      description: description,
      cashId: cashId,
      gestorId: gestorId,
    };
    return this.http.post(`${this.apiUrl}${this.API_PATH}register`, body);
  }

  // Obtener turnos por caja
  getTurnsByCash(cashId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}${this.API_PATH}${cashId}`);
  }

  // Obtener todos los turnos
  getAllTurns(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}${this.API_PATH}`);
  }
  //CASH
  assignUserToCash(cashId: string, userId: string): Observable<any> {
    const gestorId = this.authService.getUserInfo().id;

    return this.http.post(`${this.apiUrl}${this.API_PATH_CASH}assignUser`, {
      cashId,
      userId,
      gestorId: gestorId,
    });
  }

  getCashWithUsers(cashId: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}${this.API_PATH_CASH}cashUser/${cashId}`
    );
  }

  getAllCashWithUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}${this.API_PATH_CASH}`);
  }
}
