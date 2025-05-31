import { TestBed } from '@angular/core/testing';
import { AdministradorService } from './administrador.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment'; 
import { administrador } from '../models/administrador'; 

describe('AdministradorService', () => {
  let service: AdministradorService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.urlApiBase + 'administrador'; 

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdministradorService]
    });

    service = TestBed.inject(AdministradorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {

    httpMock.verify();
  });

  it('debe ser creado', () => {
    expect(service).toBeTruthy();
  });



  it('debe obtener todos los administradores (GET)', () => {
    const mockAdministradores: administrador[] = [
      { Idadminstrador: 1, Nombre: 'Admin 1', Email: 'a1@test.com', Contrasena: 'pass1' },
      { Idadminstrador: 2, Nombre: 'Admin 2', Email: 'a2@test.com',  Contrasena: 'pass2' },
    ];

    service.getAdministrador().subscribe((admins) => {
      expect(admins).toEqual(mockAdministradores);
    });

    const req = httpMock.expectOne(`${apiUrl}/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAdministradores); 
  });



  it('debe agregar un nuevo administrador (POST)', () => {
    const newAdmin: administrador = { Idadminstrador: 0, Nombre: 'Nuevo Admin', Email: 'nuevo@test.com', Contrasena: 'newpass' };

    service.postadministrador(newAdmin).subscribe((response) => {
 
      expect(response).toBeUndefined(); 
    });

    const req = httpMock.expectOne(`${apiUrl}/add`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newAdmin);
    req.flush(null); 
  });

  it('debe actualizar un administrador existente (PUT)', () => {
    const updatedAdmin: administrador = { Idadminstrador: 1, Nombre: 'Admin Actualizado',  Email: 'a1_upd@test.com', Contrasena: 'newpass' };
    const adminId = 1;

    service.putadministrador(adminId, updatedAdmin).subscribe((response) => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${apiUrl}/${adminId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedAdmin);
    req.flush(null);
  });

  it('debe eliminar un administrador (DELETE)', () => {
    const adminId = 1;

    service.deleteadministrador(adminId).subscribe((response) => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${apiUrl}/${adminId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

});