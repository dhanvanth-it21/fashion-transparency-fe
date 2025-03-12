import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { faBars, faBoxes, faClipboardList, faHouseDamage, faLongArrowAltUp, faProcedures, faShop, faSignOut, faTachometerAlt, faTruck, faUsers, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { SidebarService } from '../../core/services/sidebar.service';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

 
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

  constructor(
    private sidebarService: SidebarService,
  ) { }

  ngOnInit() {
   this.sidebarService.updateSidebarLinks(this.sidebarLinks);
  }

}
