import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiuri = 'http://localhost:8080/api/auth/signin';

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post(this.apiuri, credentials);
    
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('token') !== null;
  }

  getRole(): string[] | null {
    const loggedIn = localStorage.getItem('user');
    const user = loggedIn ? JSON.parse(loggedIn) : null;
    return user ? user.roles : null;
  }

  getUserName() {
    const loggedIn = localStorage.getItem('user');
    const user = loggedIn ? JSON.parse(loggedIn) : null;
    return user ? user.email : '';
  }

}
