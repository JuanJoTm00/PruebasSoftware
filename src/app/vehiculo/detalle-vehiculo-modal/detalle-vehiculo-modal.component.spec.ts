import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DetalleVehiculoModalComponent } from './detalle-vehiculo-modal.component';
import { vehiculo } from '../../models/vehiculo';
import { imagenvehiculo } from '../../models/imagenvehiculo';
import { ImagenvehiculoService } from '../../services/imagenvehiculo.service';
import { of, throwError } from 'rxjs';
import { SimpleChange, SimpleChanges } from '@angular/core'; // Para simular ngOnChanges

describe('DetalleVehiculoModalComponent', () => {
  let component: DetalleVehiculoModalComponent;
  let fixture: ComponentFixture<DetalleVehiculoModalComponent>;
  let imagenVehiculoServiceMock: any;

  // Datos de vehículo y imágenes de prueba
  const mockVehiculo: vehiculo = {
    Idvehiculo: 1, Marca: 'Audi', Modelo: 'A4', Ano: 2021, Kilometraje: 10000, Tipo: 'Carro', Descripcion: 'Semi-nuevo', ImagenPrincipal: 'audi_principal.jpg'
  };
  const mockImagenesAdicionales: imagenvehiculo[] = [
    { IdImagen: 101, UrlImagen: 'audi_lateral.jpg', IdVehiculo: 1 },
    { IdImagen: 102, UrlImagen: 'audi_interior.jpg', IdVehiculo: 1 }
  ];

  beforeEach(async () => {
    imagenVehiculoServiceMock = {
      getImagenesPorVehiculo: jest.fn(), // Mockear este método
    };

    await TestBed.configureTestingModule({
      declarations: [DetalleVehiculoModalComponent],
      providers: [
        { provide: ImagenvehiculoService, useValue: imagenVehiculoServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleVehiculoModalComponent);
    component = fixture.componentInstance;
    // No inicializamos vehiculoDetalle aquí, lo haremos en cada test para controlar ngOnInit/ngOnChanges
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  // --- Pruebas de ngOnInit ---
  it('debe cargar imágenes adicionales en ngOnInit si vehiculoDetalle está definido', () => {
    imagenVehiculoServiceMock.getImagenesPorVehiculo.mockReturnValue(of(mockImagenesAdicionales));
    component.vehiculoDetalle = mockVehiculo; // Asigna el input antes de ngOnInit

    component.ngOnInit(); // Llama a ngOnInit manualmente para esta prueba
    fixture.detectChanges(); // Para que Angular actualice la vista

    expect(imagenVehiculoServiceMock.getImagenesPorVehiculo).toHaveBeenCalledWith(mockVehiculo.Idvehiculo);
    // Verifica que la ImagenPrincipal se añade primero y luego las adicionales
    expect(component.imagenesAdicionales.length).toBe(mockImagenesAdicionales.length + 1);
    expect(component.imagenesAdicionales[0].UrlImagen).toBe(mockVehiculo.ImagenPrincipal);
    expect(component.imagenesAdicionales[1]).toEqual(mockImagenesAdicionales[0]);
  });

  it('NO debe cargar imágenes en ngOnInit si vehiculoDetalle es undefined', () => {
    component.vehiculoDetalle = undefined; // Asegura que no hay input
    component.ngOnInit();
    expect(imagenVehiculoServiceMock.getImagenesPorVehiculo).not.toHaveBeenCalled();
    expect(component.imagenesAdicionales).toEqual([]);
  });

  // --- Pruebas de ngOnChanges ---
  it('debe cargar imágenes cuando vehiculoDetalle cambia y tiene un valor', () => {
    imagenVehiculoServiceMock.getImagenesPorVehiculo.mockReturnValue(of(mockImagenesAdicionales));
    const newVehiculo: vehiculo = { ...mockVehiculo, Idvehiculo: 2, Marca: 'BMW' };

    // Simular el cambio en el @Input
    const changes: SimpleChanges = {
      vehiculoDetalle: new SimpleChange(undefined, newVehiculo, true) // firstChange = true
    };
    component.vehiculoDetalle = newVehiculo; // Actualiza el input del componente
    component.ngOnChanges(changes);
    fixture.detectChanges();

    expect(imagenVehiculoServiceMock.getImagenesPorVehiculo).toHaveBeenCalledWith(newVehiculo.Idvehiculo);
    expect(component.imagenesAdicionales.length).toBe(mockImagenesAdicionales.length + 1);
    expect(component.imagenesAdicionales[0].UrlImagen).toBe(newVehiculo.ImagenPrincipal);
  });

  it('debe limpiar las imágenes cuando vehiculoDetalle cambia a undefined/null', () => {
    // Primero, simula que ya hay imágenes cargadas
    component.imagenesAdicionales = [{ IdImagen: 1, UrlImagen: 'some.jpg', IdVehiculo: 1 }];
    imagenVehiculoServiceMock.getImagenesPorVehiculo.mockReturnValue(of([])); // Mock para que no cargue

    // Simular el cambio a undefined
    const changes: SimpleChanges = {
      vehiculoDetalle: new SimpleChange(mockVehiculo, undefined, false) // firstChange = false
    };
    component.vehiculoDetalle = undefined; // Actualiza el input del componente
    component.ngOnChanges(changes);
    fixture.detectChanges();

    expect(imagenVehiculoServiceMock.getImagenesPorVehiculo).not.toHaveBeenCalled(); // No debe intentar cargar
    expect(component.imagenesAdicionales).toEqual([]); // Debe estar vacío
  });

  it('NO debe cargar imágenes si vehiculoDetalle no es el input que cambió', () => {
    imagenVehiculoServiceMock.getImagenesPorVehiculo.mockClear(); // Limpiar llamadas previas
    const changes: SimpleChanges = {
      someOtherInput: new SimpleChange('old', 'new', true)
    };
    component.ngOnChanges(changes);
    expect(imagenVehiculoServiceMock.getImagenesPorVehiculo).not.toHaveBeenCalled();
  });

  // --- Pruebas de cargarImagenesVehiculo ---
  it('debe añadir ImagenPrincipal a imagenesAdicionales si existe', () => {
    imagenVehiculoServiceMock.getImagenesPorVehiculo.mockReturnValue(of(mockImagenesAdicionales));
    component.vehiculoDetalle = { ...mockVehiculo, ImagenPrincipal: 'custom_principal.jpg' }; // Vehículo con ImagenPrincipal

    component.cargarImagenesVehiculo(mockVehiculo.Idvehiculo);
    fixture.detectChanges();

    expect(component.imagenesAdicionales[0].UrlImagen).toBe('custom_principal.jpg');
    expect(component.imagenesAdicionales.length).toBe(mockImagenesAdicionales.length + 1);
  });

  it('debe manejar errores al cargar imágenes adicionales', () => {
    imagenVehiculoServiceMock.getImagenesPorVehiculo.mockReturnValue(throwError(() => new Error('Error de API')));
    component.vehiculoDetalle = mockVehiculo; // Necesario para que la llamada se haga

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Espiar console.error
    component.cargarImagenesVehiculo(mockVehiculo.Idvehiculo);
    fixture.detectChanges();

    expect(consoleSpy).toHaveBeenCalledWith('Error al cargar imágenes adicionales del vehículo:', expect.any(Error));
    expect(component.imagenesAdicionales).toEqual([]); // Debe limpiar la lista en caso de error
    consoleSpy.mockRestore(); // Restaurar console.error
  });

  // --- Pruebas de cerrar (EventEmitter) ---
  it('debe emitir el evento cerrarModal al llamar a cerrar()', () => {
    jest.spyOn(component.cerrarModal, 'emit'); // Espía el EventEmitter
    component.cerrar();
    expect(component.cerrarModal.emit).toHaveBeenCalled();
  });
});