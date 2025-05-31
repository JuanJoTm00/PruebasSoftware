import { TestBed } from '@angular/core/testing';
import { UtilityService } from './utility.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { administrador } from '../models/administrador';
import { BehaviorSubject } from 'rxjs';
import { ElementRef } from '@angular/core';
import { Modal } from 'bootstrap';

jest.mock('bootstrap', () => ({
  Modal: {
    getOrCreateInstance: jest.fn(() => ({
      show: jest.fn(),
    })),
    getInstance: jest.fn(() => ({
      hide: jest.fn(),
    })),
  },
}));

describe('UtilityService', () => {
  let service: UtilityService;
  let httpMock: HttpTestingController;
  const apiBaseUrl = environment.urlApiBase + 'administrador';

  const sessionStorageMock = (() => {
    let store: { [key: string]: string } = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => { store[key] = value.toString(); },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { store = {}; }
    };
  })();

  beforeAll(() => {
    Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UtilityService]
    });

    service = TestBed.inject(UtilityService);
    httpMock = TestBed.inject(HttpTestingController);

    sessionStorageMock.clear();
    (Modal.getOrCreateInstance as jest.Mock).mockClear();
    (Modal.getInstance as jest.Mock).mockClear();

    (service as any)['currentUserSubject'] = new BehaviorSubject<administrador | undefined>(undefined);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debe iniciar sesión y almacenar el administrador si las credenciales son correctas', (done) => {
    const mockAdmin: administrador = { Idadminstrador: 1, Nombre: 'testuser', Email: 'test@example.com', Contrasena: 'hashedpass' };
    const loginPayload = { Nombre: 'testuser', Contrasena: 'password123' };

    service.login(loginPayload.Nombre, loginPayload.Contrasena).subscribe(isLoggedIn => {
      expect(isLoggedIn).toBe(true);
      service.getCurrenUser().subscribe(user => {
        expect(user).toEqual(mockAdmin);
        done();
      });
    });

    const req = httpMock.expectOne(`${apiBaseUrl}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(loginPayload);
    req.flush(mockAdmin);
  });

  it('NO debe iniciar sesión si las credenciales son incorrectas (API devuelve null)', (done) => {
    const loginPayload = { Nombre: 'wronguser', Contrasena: 'wrongpass' };

    service.login(loginPayload.Nombre, loginPayload.Contrasena).subscribe(isLoggedIn => {
      expect(isLoggedIn).toBe(false);
      service.getCurrenUser().subscribe(user => {
        expect(user).toBeUndefined();
        done();
      });
    });

    const req = httpMock.expectOne(`${apiBaseUrl}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });



  it('debe devolver el usuario actual a través de getCurrenUser', (done) => {
    const mockAdmin: administrador = { Idadminstrador: 1, Nombre: 'Test User', Email: 't@t.com', Contrasena: '123' };
    (service as any)['currentUserSubject'].next(mockAdmin);

    service.getCurrenUser().subscribe(user => {
      expect(user).toEqual(mockAdmin);
      done();
    });
  });

  it('debe cerrar la sesión del usuario (logout)', () => {
    const mockAdmin: administrador = { Idadminstrador: 1, Nombre: 'Logged In', Email: 'li@li.com', Contrasena: 'abc' };
    service.setSession('UsuariokeySession', mockAdmin);
    (service as any)['currentUserSubject'].next(mockAdmin);

    service.logout();

    expect(sessionStorageMock.getItem(btoa('UsuariokeySession'))).toBeNull();

    service.getCurrenUser().subscribe(user => {
      expect(user).toBeUndefined();
    });
  });



  it('AbrirModal no debe fallar si recibe undefined', () => {
    expect(() => service.AbrirModal(undefined)).not.toThrow();
  });

  it('CerrarModal debe llamar a hide, remover backdrop y limpiar body', () => {
    const mockNativeElement = document.createElement('div');
    const mockElementRef = new ElementRef(mockNativeElement);
    const mockModalInstance = { hide: jest.fn() };

    // Crear backdrop simulado en el DOM
    const backdrop = document.createElement('div');
    backdrop.classList.add('modal-backdrop', 'fade', 'show');
    document.body.appendChild(backdrop);

    (Modal.getInstance as jest.Mock).mockReturnValue(mockModalInstance);

    const removeAttributeSpy = jest.spyOn(document.body, 'removeAttribute');

    service.CerrarModal(mockElementRef);

    expect(Modal.getInstance).toHaveBeenCalledWith(mockNativeElement);
    expect(mockModalInstance.hide).toHaveBeenCalled();

    // Verificar que el backdrop fue removido
    expect(document.body.querySelector('.modal-backdrop.fade.show')).toBeNull();

    expect(removeAttributeSpy).toHaveBeenCalledWith('style');
    expect(removeAttributeSpy).toHaveBeenCalledWith('class');

    removeAttributeSpy.mockRestore();
  });

  it('CerrarModal no debe fallar si recibe undefined', () => {
    expect(() => service.CerrarModal(undefined)).not.toThrow();
  });

});
