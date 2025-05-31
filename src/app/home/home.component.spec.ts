import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { VehiculoService } from '../services/vehiculo.service';
import { of } from 'rxjs';
import { vehiculo } from '../models/vehiculo';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let vehiculoServiceMock: any;

  const mockVehiculos: vehiculo[] = [
    { Idvehiculo: 1, Marca: 'Toyota', Modelo: 'Corolla', Ano: 2020, Kilometraje: 15000, Descripcion: 'Buen estado', ImagenPrincipal: 'img1.jpg', Tipo: 'Carro' },
    { Idvehiculo: 2, Marca: 'Honda', Modelo: 'Civic', Ano: 2018, Kilometraje: 30000, Descripcion: 'Excelente', ImagenPrincipal: 'img2.jpg', Tipo: 'Carro' },
  ];

  beforeEach(async () => {
    vehiculoServiceMock = {
      getvehiculo: jest.fn().mockReturnValue(of(mockVehiculos))
    };

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        { provide: VehiculoService, useValue: vehiculoServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ejecuta ngOnInit
  });

  it('debe crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar la lista de vehículos al inicializarse', () => {
    expect(vehiculoServiceMock.getvehiculo).toHaveBeenCalled();
    expect(component.vehiculo).toEqual(mockVehiculos);
  });

  it('debe mostrar los detalles del vehículo al hacer clic en "verDetalles"', () => {
    const vehiculoSeleccionado = mockVehiculos[0];
    component.bsModal = { show: jest.fn() } as any; // Simular instancia de Modal

    component.verDetalles(vehiculoSeleccionado);

    expect(component.vehiculoSeleccionado).toEqual(vehiculoSeleccionado);
    expect(component.bsModal?.show).toHaveBeenCalled();
  });

  it('debe cerrar los detalles y limpiar el vehículo seleccionado', () => {
    component.vehiculoSeleccionado = mockVehiculos[1];
    component.bsModal = { hide: jest.fn() } as any; // Simular instancia de Modal

    component.cerrarDetalles();

    expect(component.vehiculoSeleccionado).toBeUndefined();
    expect(component.bsModal?.hide).toHaveBeenCalled();
  });
});
