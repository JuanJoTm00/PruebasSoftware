import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarVehiculoComponent } from './listar-vehiculo.component';
import { of, throwError } from 'rxjs';
import { ElementRef } from '@angular/core';
import { VehiculoService } from '../../services/vehiculo.service';
import { UtilityService } from '../../services/utility.service';
import { ImagenvehiculoService } from '../../services/imagenvehiculo.service';
import { vehiculo } from '../../models/vehiculo';
import { imagenvehiculo } from '../../models/imagenvehiculo';
import Swal from 'sweetalert2';

describe('ListarVehiculoComponent', () => {
  let component: ListarVehiculoComponent;
  let fixture: ComponentFixture<ListarVehiculoComponent>;
  let vehiculoServiceMock: any;
  let imagenvehiculoServiceMock: any;
  let utilityServiceMock: any;

  const mockVehiculos: vehiculo[] = [
    { Idvehiculo: 1, Marca: 'Ford', Modelo: 'Fiesta', Ano: 2022, Kilometraje: 5000, Descripcion: 'Nuevo', ImagenPrincipal: 'ford.jpg', Tipo: 'Carro' },
    { Idvehiculo: 2, Marca: 'Nissan', Modelo: 'Frontier', Ano: 2021, Kilometraje: 10000, Descripcion: 'Pickup', ImagenPrincipal: 'nissan.jpg', Tipo: 'Carro' }
  ];

  const mockImagenes: imagenvehiculo[] = [
    { IdImagen: 1, IdVehiculo: 1, UrlImagen: 'img1.jpg' },
    { IdImagen: 2, IdVehiculo: 1, UrlImagen: 'img2.jpg' }
  ];

  beforeEach(async () => {
    jest.spyOn(Swal, 'fire').mockResolvedValue({ isConfirmed: true, isDismissed: false, isDenied: false });

    vehiculoServiceMock = {
      getvehiculo: jest.fn().mockReturnValue(of(mockVehiculos)),
      postvehiculo: jest.fn().mockReturnValue(of({ Idvehiculo: 3 })),
      putvehiculo: jest.fn().mockReturnValue(of(true)),
      deletevehiculo: jest.fn().mockReturnValue(of(true))
    };

    imagenvehiculoServiceMock = {
      getImagenesPorVehiculo: jest.fn().mockReturnValue(of(mockImagenes)),
      agregarImagen: jest.fn().mockReturnValue(of(mockImagenes[0])),
      eliminarImagen: jest.fn().mockReturnValue(of(true))
    };

    utilityServiceMock = {
      AbrirModal: jest.fn(),
      CerrarModal: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [ListarVehiculoComponent],
      providers: [
        { provide: VehiculoService, useValue: vehiculoServiceMock },
        { provide: ImagenvehiculoService, useValue: imagenvehiculoServiceMock },
        { provide: UtilityService, useValue: utilityServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListarVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar vehículos al iniciar', () => {
    expect(vehiculoServiceMock.getvehiculo).toHaveBeenCalled();
    expect(component.Vectorvehiculo.length).toBe(2);
  });

  it('debe abrir el modal y cargar imágenes al editar un vehículo', () => {
    const vehiculoParaEditar = mockVehiculos[0];
    component.Editarvehiculo(vehiculoParaEditar);

    expect(utilityServiceMock.AbrirModal).toHaveBeenCalled();
    expect(imagenvehiculoServiceMock.getImagenesPorVehiculo).toHaveBeenCalledWith(vehiculoParaEditar.Idvehiculo);
    expect(component.vehiculoSeleccionado?.Idvehiculo).toBe(vehiculoParaEditar.Idvehiculo);
    expect(component.vehiculoSeleccionado?.Imagenes?.length).toBe(mockImagenes.length);
  });



  it('debe eliminar un vehículo correctamente', async () => {
    await component.Eliminarvehiculo(1);
    expect(vehiculoServiceMock.deletevehiculo).toHaveBeenCalledWith(1);
  });



  it('debe agregar una imagen localmente si el vehículo aún no se ha guardado (ID=0)', () => {
    component.Nuevovehiculo();
    component.AgregarImagenVehiculo('nueva.jpg');

    expect(component.vehiculoSeleccionado?.Imagenes?.length).toBe(1);
    expect(component.vehiculoSeleccionado?.Imagenes?.[0].UrlImagen).toBe('nueva.jpg');
  });

  it('debe llamar a agregarImagen si el vehículo ya está guardado (ID > 0)', () => {
    const vehiculoGuardado = mockVehiculos[0];
    component.vehiculoSeleccionado = { ...vehiculoGuardado, Imagenes: [] };

    component.AgregarImagenVehiculo('img.jpg');
    expect(imagenvehiculoServiceMock.agregarImagen).toHaveBeenCalled();
  });

  it('debe eliminar una imagen existente si IdImagen > 0', async () => {
    const imagenAEliminar = mockImagenes[0];
    component.vehiculoSeleccionado = { ...mockVehiculos[0], Imagenes: [imagenAEliminar] };

    await component.EliminarImagenVehiculo(imagenAEliminar.IdImagen);
    expect(imagenvehiculoServiceMock.eliminarImagen).toHaveBeenCalledWith(imagenAEliminar.IdImagen);
    expect(component.vehiculoSeleccionado.Imagenes?.length).toBe(0);
  });
});
