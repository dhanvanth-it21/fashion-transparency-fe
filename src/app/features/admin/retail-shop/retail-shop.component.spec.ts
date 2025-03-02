import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailShopComponent } from './retail-shop.component';

describe('RetailShopComponent', () => {
  let component: RetailShopComponent;
  let fixture: ComponentFixture<RetailShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetailShopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetailShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
