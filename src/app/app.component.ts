import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminModule } from './features/admin/admin.module';
import { ViewModule } from './core/main-layout/view/view.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ViewModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tiles-hub-fe';
}
