import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginData = { email: '', password: '' };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.loginData).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role); // Store user role

        if (response.role === 'ADMIN') {
          this.router.navigate(['/admin-dashboard']);
        } else if (response.role === 'SUPER_ADMIN') {
          this.router.navigate(['/super-admin-dashboard']);
        } else {
          this.router.navigate(['/employee-dashboard']);
        }
      },
      error: (err) => {
        this.errorMessage = 'Invalid credentials!';
      }
    });
  }

}
