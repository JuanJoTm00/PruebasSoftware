import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HomeComponent } from '../home/home.component';
import { VehiculoService } from '../services/vehiculo.service';
import { of } from 'rxjs';
import { vehiculo } from '../models/vehiculo';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// Mock de datos
const VEHICULOS_MOCK: vehiculo[] = [
  {
    Idvehiculo: 1,
    Marca: 'Toyota',
    Modelo: 'Corolla',
    Ano: 2020,
    Kilometraje: 50000,
    Tipo: 'Carro',
    Descripcion: 'Buen estado',
    ImagenPrincipal: 'https://example.com/img.jpg',
    Imagenes: []
  }
];


describe('Interacción de Modales y Datos en HomeComponent (con Jest)', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockVehiculoService: jest.Mocked<VehiculoService>;

  beforeEach(async () => {
    const vehiculoServiceMock = {
      getvehiculo: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: VehiculoService, useValue: vehiculoServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    mockVehiculoService = TestBed.inject(VehiculoService) as jest.Mocked<VehiculoService>;
  });

  it('debe cargar la lista de vehículos al inicializar', () => {
    mockVehiculoService.getvehiculo.mockReturnValue(of(VEHICULOS_MOCK));

    component.ngOnInit();

    expect(mockVehiculoService.getvehiculo).toHaveBeenCalled();
    expect(component.vehiculo.length).toBe(1);
    expect(component.vehiculo[0].Marca).toBe('Toyota');
  });

  it('debe establecer el vehículo seleccionado y abrir el modal al ver detalles', fakeAsync(() => {
    mockVehiculoService.getvehiculo.mockReturnValue(of(VEHICULOS_MOCK));
    component.ngOnInit();
    tick();

    // Asignamos el mock sin problemas de tipo
    component.bsModal = {
      show: jest.fn(),
      hide: jest.fn()
    }  as any;

    component.verDetalles(VEHICULOS_MOCK[0]);

    expect(component.vehiculoSeleccionado).toEqual(VEHICULOS_MOCK[0]);
    expect(component.bsModal?.show).toHaveBeenCalled();
  }));

  it('debe cerrar el modal y limpiar el vehículo seleccionado', fakeAsync(() => {
    component.vehiculoSeleccionado = VEHICULOS_MOCK[0];
    component.bsModal = {
      show: jest.fn(),
      hide: jest.fn()
    } as any;

    component.cerrarDetalles();

    expect(component.vehiculoSeleccionado).toBeUndefined();
    expect(component.bsModal?.hide).toHaveBeenCalled();
  }));
});
