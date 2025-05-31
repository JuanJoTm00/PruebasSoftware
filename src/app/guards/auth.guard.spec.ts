import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { UtilityService } from '../services/utility.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuard', () => {
  let utilityServiceMock: any;
  let router: Router;
  let guard: AuthGuard;

  const mockRoute: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
  const mockState: RouterStateSnapshot = {} as RouterStateSnapshot;

  beforeEach(() => {
    utilityServiceMock = {
      isLoggedIn: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        AuthGuard,
        { provide: UtilityService, useValue: utilityServiceMock }
      ]
    });

    router = TestBed.inject(Router);
    guard = TestBed.inject(AuthGuard);

    jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true)); // mockear navegación
  });

  it('debe permitir la navegación si el usuario está logueado', () => {
    utilityServiceMock.isLoggedIn.mockReturnValue(true);

    const result = guard.canActivate(mockRoute, mockState);

    expect(result).toBe(true);
  });

  it('debe redirigir a /login y denegar la navegación si el usuario no está logueado', () => {
    utilityServiceMock.isLoggedIn.mockReturnValue(false);

    const result = guard.canActivate(mockRoute, mockState);

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
