import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDamageReportComponent } from './create-damage-report.component';

describe('CreateDamageReportComponent', () => {
  let component: CreateDamageReportComponent;
  let fixture: ComponentFixture<CreateDamageReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDamageReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDamageReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
