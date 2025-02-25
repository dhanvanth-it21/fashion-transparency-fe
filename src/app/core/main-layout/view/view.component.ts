import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { LeftSidebarComponent } from "../left-sidebar/left-sidebar.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [NavbarComponent, LeftSidebarComponent, RouterModule],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent {

}
