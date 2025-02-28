import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { AddTileComponent } from "./add-tile/add-tile.component";
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../shared/services/api.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Tile } from '../models/tile.modle';
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [RouterModule, AddTileComponent, CommonModule, MatTableModule, MatIconModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent {
  isAddTileComponentOpen: Boolean = false;
  
  public displayedColumns = ['skuCode', 'brandName', 'modelName', 'tileSize', 'quantity/pieces', 'details', 'update', 'delete'
  ];
  public dataSource = new MatTableDataSource<Tile>();
  
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
  ) {}
  
  ngOnInit() {


    this.getTilesList();


    if(this.router.url === "/admin/inventory/add-tile") {
      this.isAddTileComponentOpen = true;
    }
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        if(event.url === "/admin/inventory/add-tile"){
          this.isAddTileComponentOpen = true;
        }
        else {
          this.isAddTileComponentOpen = false;
        }
      }
    })
  }


  openAddTileComponent() {
    this.router.navigate(["add-tile"], { relativeTo: this.activatedRoute }); 
  }
  
  closeAddTileComponent() {
    this.router.navigate(["/admin/inventory"]);
  }

  getTilesList() {
    this.apiService.getTilesList().subscribe(
      {
        next : (response: any) => {
          if (response.status === "success" && response.data) {
            this.dataSource.data = response.data as Tile[];
            console.log(response.data);
        } 
        },
        error : (e) => {console.error(e)},
      }
    )
  }

  public redirectToDetails = (id: string) => {
    
  }
  public redirectToUpdate = (id: string) => {
    
  }
  public redirectToDelete = (id: string) => {
    
  }

}
