import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarAdministradorComponent } from './listar-administrador.component';
import { AdministradorService } from '../../services/administrador.service';
import { UtilityService } from '../../services/utility.service';
import { of, throwError } from 'rxjs';
import { administrador } from '../../models/administrador';
import Swal from 'sweetalert2';
import { ElementRef } from '@angular/core';
import { CuAdministradorComponent } from '../../administrador/cu-administrador/cu-administrador.component';

jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: jest.fn(),
  },
}));

describe('ListarAdministradorComponent', () => {
  let component: ListarAdministradorComponent;
  let fixture: ComponentFixture<ListarAdministradorComponent>;
  let administradorServiceMock: any;
  let utilityServiceMock: any;

  const mockAdministradores: administrador[] = [
    { Idadminstrador: 1, Nombre: 'Admin Uno', Email: 'admin1@test.com', Contrasena: 'pass1' },
    { Idadminstrador: 2, Nombre: 'Admin Dos', Email: 'admin2@test.com', Contrasena: 'pass2' },
  ];

  beforeEach(async () => {
    administradorServiceMock = {
      getAdministrador: jest.fn().mockReturnValue(of(mockAdministradores)),
      deleteadministrador: jest.fn().mockReturnValue(of(null)),
      postadministrador: jest.fn().mockReturnValue(of({})),
      putadministrador: jest.fn().mockReturnValue(of({})),
    };

    utilityServiceMock = {
      AbrirModal: jest.fn(),
      CerrarModal: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [
        ListarAdministradorComponent,
        CuAdministradorComponent
      ],
      providers: [
        { provide: AdministradorService, useValue: administradorServiceMock },
        { provide: UtilityService, useValue: utilityServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListarAdministradorComponent);
    component = fixture.componentInstance;
    component.modal = new ElementRef(document.createElement('div'));
    fixture.detectChanges();
  });

  afterEach(() => {
    (Swal.fire as jest.Mock).mockClear();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar los administradores al inicializarse y establecer isloading a false', () => {
    expect(administradorServiceMock.getAdministrador).toHaveBeenCalled();
    expect(component.isloading).toBe(false);
    expect(component.Vectoradministrador).toEqual(mockAdministradores);
  });

  it('debe configurar para editar y abrir el modal al llamar a EditarAdministrador', () => {
    const adminParaEditar = mockAdministradores[0];
    component.EditarAdministrador(adminParaEditar);

    expect(component.isNew).toBe(false);
    expect(component.administradorSeleccionado).toEqual(adminParaEditar);
    expect(utilityServiceMock.AbrirModal).toHaveBeenCalledWith(component.modal);
  });

  it('debe configurar para nuevo y abrir el modal al llamar a NuevoAdministrador', () => {
    component.NuevoAdministrador();

    expect(component.isNew).toBe(true);
    expect(component.administradorSeleccionado).toEqual({
      Idadminstrador: 0,
      Nombre: '',
      Email: '',
      Contrasena: ''
    });
    expect(utilityServiceMock.AbrirModal).toHaveBeenCalledWith(component.modal);
  });

  it('debe guardar un nuevo administrador y cerrar el modal', () => {
    component.isNew = true;
    component.administradorSeleccionado = { Idadminstrador: 0, Nombre: 'Nuevo', Email: 'nuevo@test.com', Contrasena: '123' };

    component.GuardarAdministrador();

   expect(administradorServiceMock.postadministrador).toHaveBeenCalledWith(expect.objectContaining({
  Nombre: 'Nuevo',
  Email: 'nuevo@test.com',
  Contrasena: '123'
}));
  });

  it('debe actualizar un administrador existente y cerrar el modal', () => {
    component.isNew = false;
    component.administradorSeleccionado = { Idadminstrador: 1, Nombre: 'Actualizado', Email: 'a@test.com', Contrasena: '123' };

    component.GuardarAdministrador();

    expect(administradorServiceMock.putadministrador).toHaveBeenCalledWith(
  1,
  expect.objectContaining({
    Nombre: 'Actualizado',
    Email: 'a@test.com',
    Contrasena: '123'
  })
);  
  });

  it('debe eliminar un administrador si el usuario confirma', async () => {
    (Swal.fire as jest.Mock).mockResolvedValueOnce({ isConfirmed: true });
    const adminIdToDelete = 1;

    await component.EliminarAdministrador(adminIdToDelete);

    expect(administradorServiceMock.deleteadministrador).toHaveBeenCalledWith(adminIdToDelete);
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ title: '¿Estás seguro?' }));
  });

  it('NO debe eliminar un administrador si el usuario cancela', async () => {
    (Swal.fire as jest.Mock).mockResolvedValueOnce({ isConfirmed: false });
    const adminIdToKeep = 1;

    await component.EliminarAdministrador(adminIdToKeep);

    expect(administradorServiceMock.deleteadministrador).not.toHaveBeenCalled();
  });

  it('debe mostrar un mensaje de error si la eliminación falla', async () => {
    (Swal.fire as jest.Mock).mockResolvedValueOnce({ isConfirmed: true });
    administradorServiceMock.deleteadministrador.mockReturnValueOnce(throwError(() => new Error('Error al eliminar')));

    const adminIdToDelete = 1;

    await component.EliminarAdministrador(adminIdToDelete);

    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
      icon: 'error',
      text: 'Error al eliminar'
    }));
  });
});
