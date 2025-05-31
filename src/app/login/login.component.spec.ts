import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { UtilityService } from '../services/utility.service';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let routerMock: any;
  let utilServiceMock: any;

  beforeEach(async () => {
    routerMock = {
      navigate: jest.fn()
    };

    utilServiceMock = {
      login: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: UtilityService, useValue: utilServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe navegar a "/" si el login es exitoso', fakeAsync(() => {

    component.ad = 'admin';
    component.pwd = '1234';
    utilServiceMock.login.mockReturnValue(of(true));

 
    component.login();
    tick();

 
    expect(utilServiceMock.login).toHaveBeenCalledWith('admin', '1234');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('debe mostrar alerta si el login falla', fakeAsync(() => {

    const swalSpy = jest.spyOn(Swal, 'fire');

    component.ad = 'admin';
    component.pwd = 'wrong';
    utilServiceMock.login.mockReturnValue(of(false));

    component.login();
    tick();

    expect(utilServiceMock.login).toHaveBeenCalledWith('admin', 'wrong');
    expect(swalSpy).toHaveBeenCalledWith({
      title: 'Nombre o contraseña incorrectos',
      icon: 'error'
    });
  }));
});
