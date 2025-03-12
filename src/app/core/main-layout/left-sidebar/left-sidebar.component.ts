import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faBars, faBoxes, faClipboardList, faHouseDamage, faLongArrowAltUp, faProcedures, faShop, faSignOut, faTachometerAlt, faTruck, faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, RouterModule],
  templateUrl: './left-sidebar.component.html',
  styleUrl: './left-sidebar.component.css'
})
export class LeftSidebarComponent {

  @Input()
  sidebarLinks: { path: string, icon: IconDefinition, label: string }[] = [];


  public faBars: IconDefinition = faBars;
  public faSignOut: IconDefinition = faSignOut;
  


 
  



  username: string =  "Dhanvanth S B";


  isHovered: boolean = false;


}
