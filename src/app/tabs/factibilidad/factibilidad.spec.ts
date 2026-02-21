import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Factibilidad } from './factibilidad';

describe('Detalles', () => {
  let component: Factibilidad;
  let fixture: ComponentFixture<Factibilidad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Factibilidad]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Factibilidad);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
