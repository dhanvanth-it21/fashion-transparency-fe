import { Injectable } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  constructor() { }
  private sidebarLinksSource = new BehaviorSubject<{ path: string, icon: IconDefinition, label: string }[]>([]);
  sidebarLinks$ = this.sidebarLinksSource.asObservable();

  updateSidebarLinks(links: { path: string; icon: IconDefinition; label: string }[]) {
    this.sidebarLinksSource.next(links);
  }
}
