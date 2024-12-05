import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavDashoboardComponent } from './nav-dashoboard.component';

describe('NavDashoboardComponent', () => {
  let component: NavDashoboardComponent;
  let fixture: ComponentFixture<NavDashoboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavDashoboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavDashoboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
