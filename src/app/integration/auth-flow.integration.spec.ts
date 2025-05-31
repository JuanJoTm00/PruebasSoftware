
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginComponent } from '../login/login.component'; 
import { ListarAdministradorComponent } from '../administrador/listar-administrador/listar-administrador.component'; 
import { HomeComponent } from '../home/home.component'; 
import { UtilityService } from '../services/utility.service';
import { AuthGuard } from '../guards/auth.guard';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';
import { Component, ElementRef } from '@angular/core';
import { AdministradorService } from '../services/administrador.service';
import { CuAdministradorComponent } from '../administrador/cu-administrador/cu-administrador.component';



jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: jest.fn(),
  },
}));


@Component({ standalone:true,template: '<div>Contenido de Administrador</div>' })
class DummyAdminComponent {}


@Component({ standalone:true, template: '<div>Página de Inicio</div>' })
class DummyHomeComponent {}



describe('Integración: Flujo de Autenticación y Rutas Protegidas', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let router: Router;
  let httpMock: HttpTestingController;
  let utilityService: UtilityService; 

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

  beforeEach(async () => {
    sessionStorageMock.clear();
    (Swal.fire as jest.Mock).mockClear(); 

    await TestBed.configureTestingModule({
      declarations: [
        LoginComponent, 
        ListarAdministradorComponent, 
        HomeComponent, 
        CuAdministradorComponent 
      ],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: LoginComponent },
          { path: '', component: DummyHomeComponent, canActivate: [AuthGuard] }, 
          { path: 'administrador', component: DummyAdminComponent, canActivate: [AuthGuard] }, 
          { path: 'home', component: DummyHomeComponent, canActivate: [AuthGuard] }, 
        ]),
        DummyAdminComponent, 
        DummyHomeComponent
      ],
      providers: [
        UtilityService,
        AuthGuard,
        AdministradorService, 
        { provide: ElementRef, useValue: { nativeElement: {} } } 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    httpMock = TestBed.inject(HttpTestingController);
    utilityService = TestBed.inject(UtilityService); 

    fixture.detectChanges();
    router.initialNavigation(); 
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('debe permitir el login y navegar a la ruta protegida', fakeAsync(() => {

    component.ad = 'adminUser';
    component.pwd = 'adminPass';
    fixture.detectChanges(); 


    const navigateSpy = jest.spyOn(router, 'navigate');


    const loginButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    loginButton.click();
    tick(); 


    const req = httpMock.expectOne(`${apiBaseUrl}/login`);
    expect(req.request.method).toBe('POST');
    req.flush({ Idadminstrador: 1, Nombre: 'adminUser', Email: 'a@a.com', Contrasena: 'hashedpass' });
    tick(); 


    expect(navigateSpy).toHaveBeenCalledWith(['/']);
    expect(utilityService.isLoggedIn()).toBe(true); 


    router.navigate(['/administrador']);
    tick(); 


    expect(router.url).toBe('/administrador');

  }));

  it('NO debe permitir el login con credenciales incorrectas y NO debe navegar', fakeAsync(() => {

    component.ad = 'wrongUser';
    component.pwd = 'wrongPass';
    fixture.detectChanges();

    const navigateSpy = jest.spyOn(router, 'navigate');
    const swalFireSpy = jest.spyOn(Swal, 'fire');


    const loginButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    loginButton.click();
    tick();


    const req = httpMock.expectOne(`${apiBaseUrl}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(null); 
    tick();


    expect(navigateSpy).not.toHaveBeenCalled();
    expect(utilityService.isLoggedIn()).toBe(false); 


    expect(swalFireSpy).toHaveBeenCalledWith({
      title: 'Nombre o contraseña incorrectos',
      icon: 'error'
    });


    router.navigate(['/administrador']);
    tick();

    expect(router.url).toBe('/login'); 
  }));


  it('debe redirigir a /login si se intenta acceder a una ruta protegida sin autenticar', fakeAsync(() => {

    expect(utilityService.isLoggedIn()).toBe(false);

    const navigateSpy = jest.spyOn(router, 'navigate');


    router.navigate(['/administrador']);
    tick(); 

    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    expect(router.url).toBe('/login'); 
  }));

});