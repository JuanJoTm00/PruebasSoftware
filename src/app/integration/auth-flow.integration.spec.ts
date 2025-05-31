
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginComponent } from '../login/login.component'; // Asegúrate de que la ruta sea correcta
import { ListarAdministradorComponent } from '../administrador/listar-administrador/listar-administrador.component'; // Un componente protegido
import { HomeComponent } from '../home/home.component'; // Otro componente para simular la página de inicio
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


// Mock de SweetAlert2 para evitar que abra popups durante los tests
jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: jest.fn(),
  },
}));

// Un componente dummy para rutas protegidas
@Component({ standalone:true,template: '<div>Contenido de Administrador</div>' })
class DummyAdminComponent {}

// Un componente dummy para la página de inicio (no protegida)
@Component({ standalone:true, template: '<div>Página de Inicio</div>' })
class DummyHomeComponent {}



describe('Integración: Flujo de Autenticación y Rutas Protegidas', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let router: Router;
  let httpMock: HttpTestingController;
  let utilityService: UtilityService; // Usaremos el servicio real aquí, ya que su login es lo que probamos

  const apiBaseUrl = environment.urlApiBase + 'administrador';

  // Mock de sessionStorage para que no interfiera con el navegador real
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
    sessionStorageMock.clear(); // Limpiar session storage antes de cada test
    (Swal.fire as jest.Mock).mockClear(); // Limpiar el mock de SweetAlert2

    await TestBed.configureTestingModule({
      declarations: [
        LoginComponent, 
        ListarAdministradorComponent, // Necesario si ListarAdministradorComponent es cargado por una ruta
        HomeComponent, // Necesario si HomeComponent es cargado por una ruta
        CuAdministradorComponent // Si es una dependencia de ListarAdministradorComponent
      ],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: LoginComponent },
          { path: '', component: DummyHomeComponent, canActivate: [AuthGuard] }, // Ruta de inicio protegida
          { path: 'administrador', component: DummyAdminComponent, canActivate: [AuthGuard] }, // Otra ruta protegida
          { path: 'home', component: DummyHomeComponent, canActivate: [AuthGuard] }, // Por si tu 'home' también está protegida
        ]),
        DummyAdminComponent, 
        DummyHomeComponent
      ],
      providers: [
        UtilityService,
        AuthGuard,
        AdministradorService, // Si el Guard o algún componente protegido lo necesita real
        { provide: ElementRef, useValue: { nativeElement: {} } } // Mock básico para ElementRef si es necesario en componentes
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    httpMock = TestBed.inject(HttpTestingController);
    utilityService = TestBed.inject(UtilityService); // Inyectamos el servicio real

    fixture.detectChanges(); // Ejecuta ngOnInit y inicializa el componente
    router.initialNavigation(); // Inicializa el router
  });

  afterEach(() => {
    httpMock.verify(); // Asegura que no queden peticiones HTTP pendientes
  });

  it('debe permitir el login y navegar a la ruta protegida', fakeAsync(() => {
    // 1. Configurar datos de login en el formulario
    component.ad = 'adminUser';
    component.pwd = 'adminPass';
    fixture.detectChanges(); // Actualizar la vista para que los ngModel se enlacen

    // Espiar el router para verificar la navegación
    const navigateSpy = jest.spyOn(router, 'navigate');

    // 2. Simular el envío del formulario
    const loginButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    loginButton.click();
    tick(); // Avanzar el tiempo para que el observable se resuelva

    // 3. Simular la respuesta exitosa del API de login
    const req = httpMock.expectOne(`${apiBaseUrl}/login`);
    expect(req.request.method).toBe('POST');
    req.flush({ Idadminstrador: 1, Nombre: 'adminUser', Email: 'a@a.com', Contrasena: 'hashedpass' });
    tick(); // Avanzar el tiempo para que la suscripción del login se complete

    // 4. Verificar que se navegó a la ruta de inicio
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
    expect(utilityService.isLoggedIn()).toBe(true); // Verificar que el estado de login es true

    // 5. Intentar navegar a una ruta protegida y verificar que se permite
    router.navigate(['/administrador']);
    tick(); // Avanzar el tiempo para la navegación del router

    // Verificar que la ruta activa es la protegida, no /login
    expect(router.url).toBe('/administrador');
    // Puedes incluso verificar que el DummyAdminComponent se ha cargado si lo necesitas
    // expect(TestBed.createComponent(DummyAdminComponent).nativeElement.textContent).toContain('Contenido de Administrador');
  }));

  it('NO debe permitir el login con credenciales incorrectas y NO debe navegar', fakeAsync(() => {
    // 1. Configurar datos de login incorrectos
    component.ad = 'wrongUser';
    component.pwd = 'wrongPass';
    fixture.detectChanges();

    const navigateSpy = jest.spyOn(router, 'navigate');
    const swalFireSpy = jest.spyOn(Swal, 'fire');

    // 2. Simular el envío del formulario
    const loginButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    loginButton.click();
    tick();

    // 3. Simular la respuesta fallida del API de login
    const req = httpMock.expectOne(`${apiBaseUrl}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(null); // API devuelve null para login fallido
    tick();

    // 4. Verificar que NO se navegó
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(utilityService.isLoggedIn()).toBe(false); // Verificar que el estado de login es false

    // 5. Verificar que se mostró una alerta de SweetAlert2
    expect(swalFireSpy).toHaveBeenCalledWith({
      title: 'Nombre o contraseña incorrectos',
      icon: 'error'
    });

    // 6. Intentar navegar a una ruta protegida y verificar que se redirige a /login
    router.navigate(['/administrador']);
    tick();

    expect(router.url).toBe('/login'); // Debe ser redirigido al login
  }));


  it('debe redirigir a /login si se intenta acceder a una ruta protegida sin autenticar', fakeAsync(() => {
    // Asegurarse de que no hay sesión activa
    expect(utilityService.isLoggedIn()).toBe(false);

    const navigateSpy = jest.spyOn(router, 'navigate');

    // Intentar navegar directamente a una ruta protegida
    router.navigate(['/administrador']);
    tick(); // Avanzar el tiempo para que el AuthGuard actúe

    // Verificar que se intentó navegar al login
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    expect(router.url).toBe('/login'); // Verificar que la URL actual es /login
  }));

});