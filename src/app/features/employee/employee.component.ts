import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { faBars, faBoxes, faClipboardList, faHouseDamage, faLongArrowAltUp, faMousePointer, faProcedures, faShop, faSignOut, faTachometerAlt, faTruck, faUsers, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { SidebarService } from '../../core/services/sidebar.service';


@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [ RouterModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {

   sidebarIcons = {
        dashboard: faTachometerAlt,
        orders: faClipboardList,    
        employees: faUsers,         
        inventory: faBoxes,  
        shop: faShop,
        supplier: faTruck,
        purchase: faTruck,
        damage: faHouseDamage,
        usage: faMousePointer,
      };
    
    sidebarLinks = [
      { path: '/employee/dashboard', icon: this.sidebarIcons.dashboard, label: 'Dashboard' },
      { path: '/employee/orders', icon: this.sidebarIcons.orders, label: 'Orders' },
      { path: '/employee/purchases', icon: this.sidebarIcons.purchase, label: 'Purchase' },
      { path: '/employee/inventory', icon: this.sidebarIcons.inventory, label: 'Inventory' },
      { path: '/employee/damage-reports', icon: this.sidebarIcons.damage, label: 'Damages' },
    ];

    constructor(
      private sidebarService: SidebarService,
    ) { 
      
    }

    ngOnInit() {
      this.sidebarService.updateSidebarLinks(this.sidebarLinks);
     }

}
