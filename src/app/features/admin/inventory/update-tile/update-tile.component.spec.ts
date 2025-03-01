import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTileComponent } from './update-tile.component';

describe('UpdateTileComponent', () => {
  let component: UpdateTileComponent;
  let fixture: ComponentFixture<UpdateTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
