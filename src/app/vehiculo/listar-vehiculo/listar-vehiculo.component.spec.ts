import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarVehiculoComponent } from './listar-vehiculo.component';
import { VehiculoService } from '../../services/vehiculo.service';
import { ImagenvehiculoService } from '../../services/imagenvehiculo.service';
import { UtilityService } from '../../services/utility.service';
import { of } from 'rxjs';
import { vehiculo } from '../../models/vehiculo';
import Swal from 'sweetalert2';


jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: jest.fn()
  }
}));

describe('ListarVehiculoComponent', () => {
  let component: ListarVehiculoComponent;
  let fixture: ComponentFixture<ListarVehiculoComponent>;
  let vehiculoServiceMock: any;
  let utilityServiceMock: any;

  beforeEach(async () => {
    vehiculoServiceMock = {
      getvehiculo: jest.fn().mockReturnValue(of([])),
      postvehiculo: jest.fn(),
      putvehiculo: jest.fn(),
      deletevehiculo: jest.fn()
    };

    const imagenvehiculoServiceMock = {
      getImagenesPorVehiculo: jest.fn().mockReturnValue(of([])) // simula que devuelve un array vacío
    };
    
    utilityServiceMock = {
      AbrirModal: jest.fn(),
      CerrarModal: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [ListarVehiculoComponent],
      providers: [
        { provide: VehiculoService, useValue: vehiculoServiceMock },
        { provide: ImagenvehiculoService, useValue:  imagenvehiculoServiceMock },
        { provide: UtilityService, useValue: utilityServiceMock, }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListarVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar vehículos al inicializarse', () => {
    expect(vehiculoServiceMock.getvehiculo).toHaveBeenCalled();
    expect(component.isloading).toBe(false);
  });

  it('debe abrir modal y seleccionar vehículo al editar', () => {
    const vehiculoMock: vehiculo = {
      Idvehiculo: 1, Marca: 'Toyota', Modelo: 'Corolla', Ano: 2020,
      Kilometraje: 50000, Tipo: 'Carro', Descripcion: 'Buen estado', ImagenPrincipal: ''
    };

    component.Editarvehiculo(vehiculoMock);
    expect(component.isNew).toBe(false);
    expect(component.vehiculoSeleccionado).toEqual(vehiculoMock);
    expect(utilityServiceMock.AbrirModal).toHaveBeenCalled();
  });

  it('debe abrir modal y crear vehículo nuevo vacío', () => {
    component.Nuevovehiculo();
    expect(component.isNew).toBe(true);
    expect(component.vehiculoSeleccionado?.Idvehiculo).toBe(0);
    expect(utilityServiceMock.AbrirModal).toHaveBeenCalled();
  });

  it('debe guardar un nuevo vehículo correctamente', () => {
    const postSpy = jest.spyOn(vehiculoServiceMock, 'postvehiculo').mockReturnValue(of({}));
    component.isNew = true;
    component.vehiculoSeleccionado = {
      Idvehiculo: 0,
      Marca: 'Nissan',
      Modelo: 'Versa',
      Ano: 2022,
      Kilometraje: 1000,
      Tipo: 'Carro',
      Descripcion: 'Nuevo',
      ImagenPrincipal: ''
    };
  
    component.Guardarvehiculo();
  
    expect(postSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        Marca: 'Nissan',
        Modelo: 'Versa',
        Ano: 2022,
        Kilometraje: 1000,
        Tipo: 'Carro',
        Descripcion: 'Nuevo',
        ImagenPrincipal: ''
      })
    );
  
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({ title: expect.stringContaining('agregado') })
    );
  });
  

  it('debe actualizar un vehículo existente correctamente', () => {
    const putSpy = jest.spyOn(vehiculoServiceMock, 'putvehiculo').mockReturnValue(of({}));
    component.isNew = false;
    component.vehiculoSeleccionado = {
      Idvehiculo: 1,
      Marca: 'Ford',
      Modelo: 'Fiesta',
      Ano: 2018,
      Kilometraje: 30000,
      Tipo: 'Carro',
      Descripcion: 'Económico',
      ImagenPrincipal: ''
    };
  
    component.Guardarvehiculo();
  
    expect(putSpy).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        Marca: 'Ford',
        Modelo: 'Fiesta',
        Ano: 2018,
        Kilometraje: 30000,
        Tipo: 'Carro',
        Descripcion: 'Económico',
        ImagenPrincipal: ''
      })
    );
  
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({ title: expect.stringContaining('actualizado') })
    );
  });
  

  it('debe eliminar un vehículo si se confirma', async () => {
    const deleteSpy = jest.spyOn(vehiculoServiceMock, 'deletevehiculo').mockReturnValue(of({}));
    (Swal.fire as jest.Mock).mockResolvedValueOnce({ isConfirmed: true });

    await component.Eliminarvehiculo(1);

    expect(deleteSpy).toHaveBeenCalledWith(1);
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ title: '¿Estás seguro?' }));
  });

  it('no debe eliminar un vehículo si se cancela', async () => {
    const deleteSpy = jest.spyOn(vehiculoServiceMock, 'deletevehiculo');
    (Swal.fire as jest.Mock).mockResolvedValueOnce({ isConfirmed: false });

    await component.Eliminarvehiculo(1);

    expect(deleteSpy).not.toHaveBeenCalled();
  });
});
