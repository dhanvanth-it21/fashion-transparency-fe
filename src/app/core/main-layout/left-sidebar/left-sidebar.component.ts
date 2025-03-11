import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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

  public faBars: IconDefinition = faBars;
  public faSignOut: IconDefinition = faSignOut;
  
  sidebarIcons = {
    dashboard: faTachometerAlt,
    orders: faClipboardList,    
    employees: faUsers,         
    inventory: faBoxes,  
    shop: faShop,
    supplier: faTruck,
    purchase: faTruck,
    damage: faHouseDamage,
  };


  sidebarLinks = [
    { path: '/admin/dashboard', icon: this.sidebarIcons.dashboard, label: 'Dashboard' },
    { path: '/admin/orders', icon: this.sidebarIcons.orders, label: 'Orders' },
    { path: '/admin/purchases', icon: this.sidebarIcons.purchase, label: 'Purchase' },
    { path: '/admin/inventory', icon: this.sidebarIcons.inventory, label: 'Inventory' },
    { path: '/admin/retail-shop', icon: this.sidebarIcons.shop, label: 'Retail Shop' },
    { path: '/admin/supplier', icon: this.sidebarIcons.supplier, label: 'Supplier' },
    { path: '/admin/damage-reports', icon: this.sidebarIcons.damage, label: 'Damages' }
  ];
  



  username: string =  "Dhanvanth S B";


  isHovered: boolean = false;


}
