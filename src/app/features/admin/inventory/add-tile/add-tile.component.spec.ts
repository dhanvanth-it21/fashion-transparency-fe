import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTileComponent } from './add-tile.component';

describe('AddTileComponent', () => {
  let component: AddTileComponent;
  let fixture: ComponentFixture<AddTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
