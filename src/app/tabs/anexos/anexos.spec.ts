import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexos } from './anexos';

describe('Anexos', () => {
  let component: Anexos;
  let fixture: ComponentFixture<Anexos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Anexos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Anexos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
