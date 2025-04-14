import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../assets/environments/environment';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  private apiUrl = `${environment.domain}`;
  private API_PATH = `/user/`;
  private API_PATH_PASSWORD = `/auth/`;

  getDecodedToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }

  loginUser(userData: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}${this.API_PATH}auth`, userData);
  }

  bulkRegisterUsers(currentUserId: string, users: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}${this.API_PATH}bulkregister`, {
      currentUserId,
      usersData: users,
    });
  }

  getUserEmail(): string | null {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = this.getDecodedToken(token);
        return decodedToken ? decodedToken.email : null;
      }
      return null;
    }
    return null;
  }
  getUserInfo(): {
    email: string | null;
    rol: string | null;
    id: string | null;
  } {
    try {
      if (typeof localStorage !== 'undefined') {
        const token = localStorage.getItem('token');
        if (!token) return { email: null, rol: null, id: null };

        const decodedToken = this.getDecodedToken(token);
        return {
          email: decodedToken?.email || null,
          rol: decodedToken?.rol || null,
          id: decodedToken?.id || null,
        };
      }
      return { email: null, rol: null, id: null };
    } catch (error) {
      console.error('Error decoding token:', error);
      return { email: null, rol: null, id: null };
    }
  }

  getUserFunctionRol(idUser: string, rol: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}${this.API_PATH}count/${idUser}/${rol}`
    );
  }

  getAllUser(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}${this.API_PATH}`);
  }

  updateValidatorUser(currentUserId: string, userId: string): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}${this.API_PATH}validator/${userId}`,
      { currentUserId }
    );
  }

  updateUser(
    editUser: any,
    currentUserId: string,
    userId: string
  ): Observable<any> {
    const requestBody = {
      editUser: {
        username: editUser.username,
        email: editUser.email,
        password: editUser.password,
        rolName: editUser.rolName,
        userstatus_statusid: editUser.userstatus_statusid,
      },
      currentUserId: currentUserId,
    };

    return this.http.put<any>(
      `${this.apiUrl}${this.API_PATH}update/${userId}`,
      requestBody
    );
  }

  deleteUser(currentUserId: string, userId: string): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}${this.API_PATH}delete/${userId}`,
      { body: { currentUserId } }
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}${this.API_PATH_PASSWORD}forgot-password`,
      { email }
    );
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}${this.API_PATH_PASSWORD}reset-password`,
      {
        token,
        newPassword,
      }
    );
  }
}
