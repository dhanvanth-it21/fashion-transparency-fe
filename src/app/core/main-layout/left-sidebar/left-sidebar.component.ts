import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faBars, faBoxes, faClipboardList, faLongArrowAltUp, faSignOut, faTachometerAlt, faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, RouterModule],
  templateUrl: './left-sidebar.component.html',
  styleUrl: './left-sidebar.component.css'
})
export class LeftSidebarComponent {

  public faBars: IconDefinition = faBars;
  public faSignOut: IconDefinition = faSignOut;
  
  sidebarIcons = {
    dashboard: faTachometerAlt,
    orders: faClipboardList,    
    employees: faUsers,         
    inventory: faBoxes,  

  };

  username: string =  "Dhanvanth S B";


  isHovered: boolean = false;


}
