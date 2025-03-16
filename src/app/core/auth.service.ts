import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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

  private roleSubject = new BehaviorSubject<string[]>([]);
  roles$  = this.roleSubject.asObservable();

  setRoles(role: string[]) {
    this.roleSubject.next(role);
  }


  getRoles() {
    const loggedIn = localStorage.getItem('user');
    const user = loggedIn ? JSON.parse(loggedIn) : null;
    this.setRoles(user.roles);
  }

  getUserName() {
    const loggedIn = localStorage.getItem('user');
    const user = loggedIn ? JSON.parse(loggedIn) : null;
    return user ? user.email : '';
  }

}
