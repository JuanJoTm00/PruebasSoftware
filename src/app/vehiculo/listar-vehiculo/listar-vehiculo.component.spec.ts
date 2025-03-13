import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarVehiculoComponent } from './listar-vehiculo.component';

describe('ListarVehiculoComponent', () => {
  let component: ListarVehiculoComponent;
  let fixture: ComponentFixture<ListarVehiculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarVehiculoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
