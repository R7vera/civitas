import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAdmiComponent } from './dashboard-admi.component';

describe('DashboardAdmiComponent', () => {
  let component: DashboardAdmiComponent;
  let fixture: ComponentFixture<DashboardAdmiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAdmiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardAdmiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
