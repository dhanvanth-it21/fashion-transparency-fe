import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {faSignOut } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  faSignOut: IconDefinition = faSignOut;

  isUserLoggedIn: boolean = false;

  userEmail!: string;
  userProfile!: string;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {

  }

  ngOnInit() {
    this.isUserLoggedIn = this.authService.isAuthenticated();
    this.getUserName();
    this.setProfile();

  }

  getUserName() {
    this.userEmail = this.authService.getUserName();
  }

  setProfile() {
    const firstLetter = this.userEmail.charAt(0).toUpperCase();
    this.userProfile = firstLetter
  }


  logoutUser() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
