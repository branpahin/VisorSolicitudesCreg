import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Solicitud075 } from './solicitud';

describe('Solicitud', () => {
  let component: Solicitud075;
  let fixture: ComponentFixture<Solicitud075>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Solicitud075]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Solicitud075);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
