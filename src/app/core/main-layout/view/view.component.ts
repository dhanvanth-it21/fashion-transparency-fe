import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { LeftSidebarComponent } from "../left-sidebar/left-sidebar.component";
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AdminModule } from '../../../features/admin/admin.module';
import { AuthService } from '../../auth.service';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { SidebarService } from '../../services/sidebar.service';


@Component({
  selector: 'app-view',
  standalone: true,
  imports: [NavbarComponent, LeftSidebarComponent, RouterModule, AdminModule],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent {

  roles: string[] | null = null;




  sidebarLinks: { path: string, icon: IconDefinition, label: string }[] = [];



  constructor(
    private authSerivice: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sidebarService: SidebarService,
  ) {}

  ngOnInit() {
    this.sidebarLinks = [];
    this.getRoles();
    if(this.roles?.includes("ROLE_ADMIN")) {
      this.router.navigate(["admin"], { relativeTo: this.activatedRoute });
    }
    else if(this.roles?.includes("ROLE_EMPLOYEE")) {
      this.router.navigate(["employee"], {relativeTo: this.activatedRoute});
    }
    setTimeout(() => {
      this.sidebarService.sidebarLinks$.subscribe(links => {
        this.sidebarLinks = links;
      })
    },0);
  }
  
  getRoles() {
    this.roles = this.authSerivice.getRole();
  }

}
