import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { AddTileComponent } from "./add-tile/add-tile.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [RouterModule, AddTileComponent, CommonModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent {
  isAddTileComponentOpen: Boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        if(event.url === "/admin/inventory/add-tile"){
          this.isAddTileComponentOpen = true;
        }
      }
    })
  }


  openAddTileComponent() {
    this.router.navigate(["add-tile"], { relativeTo: this.activatedRoute }); 
  }
  
  closeAddTileComponent() {
    this.router.navigate([".."], { relativeTo: this.activatedRoute });
  }

}
