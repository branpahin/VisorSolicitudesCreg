import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReciboTecnico } from './recibo_tecnico';

describe('Detalles', () => {
  let component: ReciboTecnico;
  let fixture: ComponentFixture<ReciboTecnico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReciboTecnico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReciboTecnico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
