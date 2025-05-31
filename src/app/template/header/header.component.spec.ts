import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { UtilityService } from '../../services/utility.service';
import { of, Subject } from 'rxjs';
import { administrador } from '../../models/administrador';
import { ElementRef } from '@angular/core';

// Mock de la clase Offcanvas de Bootstrap
class MockOffcanvasInstance {
  hide = jest.fn();
  dispose = jest.fn();
}

// Simulación global de bootstrap.Offcanvas
(window as any).bootstrap = {
  Offcanvas: jest.fn().mockImplementation(() => new MockOffcanvasInstance()),
};
(window as any).bootstrap.Offcanvas.getInstance = jest.fn().mockReturnValue(null);

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let utilityServiceMock: {
    getCurrenUser: jest.Mock;
    getSession: jest.Mock;
    logout: jest.Mock;
  };
  let authSubject: Subject<administrador | null>;

  beforeEach(async () => {
    // Creamos un Subject que simula el observable de usuario actual
    authSubject = new Subject<administrador | null>();

    utilityServiceMock = {
      getCurrenUser: jest.fn().mockReturnValue(authSubject.asObservable()), // Retornamos el subject como observable
      getSession: jest.fn(),
      logout: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [RouterTestingModule],
      providers: [{ provide: UtilityService, useValue: utilityServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;

    // Simular ViewChild offcanvasElement (div)
    component.offcanvasElement = new ElementRef(document.createElement('div'));
    jest.spyOn(component.offcanvasElement.nativeElement, 'addEventListener');
    jest.spyOn(component.offcanvasElement.nativeElement, 'removeEventListener');

    fixture.detectChanges(); // Ejecutar ngOnInit y subscribirse
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe suscribirse a los cambios de login en ngOnInit', () => {
    expect(utilityServiceMock.getCurrenUser).toHaveBeenCalled();
  });

  it('debe actualizar el login y nombre del usuario cuando cambia el observable', () => {
    const mockAdmin: administrador = {
      Idadminstrador: 1,
      Nombre: 'Test Admin',
      Email: 'test@example.com',
      Contrasena: '123',
    };

    authSubject.next(mockAdmin);
    fixture.detectChanges();

    expect(component.isUserLoggedIn).toBe(true);
    expect(component.currentUserName).toBe('Test Admin');

    authSubject.next(null);
    fixture.detectChanges();

    expect(component.isUserLoggedIn).toBe(false);
    expect(component.currentUserName).toBeNull();
  });

  it('debe limpiar el backdrop y las clases del body correctamente', () => {
    const backdropDiv = document.createElement('div');
    backdropDiv.classList.add('offcanvas-backdrop', 'fade', 'show');
    document.body.appendChild(backdropDiv);
    document.body.classList.add('offcanvas-open');
    document.body.style.overflow = 'hidden';

    component['cleanUpOffcanvasBackdropAndBody']();

    expect(document.querySelector('.offcanvas-backdrop')).toBeNull();
    expect(document.body.classList.contains('offcanvas-open')).toBe(false);
    expect(document.body.style.overflow).toBe('');
  });

  it('debe cerrar sesión y cerrar el offcanvas', () => {
    jest.spyOn(component, 'closeOffcanvas');
    component.logoutAndCloseOffcanvas();
    expect(utilityServiceMock.logout).toHaveBeenCalled();
    expect(component.closeOffcanvas).toHaveBeenCalled();
  });
});
