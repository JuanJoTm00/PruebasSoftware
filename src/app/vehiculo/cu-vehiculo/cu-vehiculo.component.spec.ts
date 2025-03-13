import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuVehiculoComponent } from './cu-vehiculo.component';

describe('CuVehiculoComponent', () => {
  let component: CuVehiculoComponent;
  let fixture: ComponentFixture<CuVehiculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CuVehiculoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
