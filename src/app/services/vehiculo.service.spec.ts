import { TestBed } from '@angular/core/testing';
import { VehiculoService } from './vehiculo.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { vehiculo } from '../models/vehiculo'; // Asegúrate de que tu modelo se llame 'vehiculo' (minúscula)
import { environment } from '../../environments/environment';

describe('VehiculoService', () => {
  let service: VehiculoService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.urlApiBase + 'vehiculo';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VehiculoService]
    });

    service = TestBed.inject(VehiculoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Asegura que no haya peticiones pendientes
  });

  it('debe ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debe obtener los vehículos (GET)', () => {
    const mockVehiculos: vehiculo[] = [
      { Idvehiculo: 1, Marca: 'Toyota', Modelo: 'Corolla', Ano: 2020, Kilometraje: 15000, Tipo: 'Carro', Descripcion: 'Buen estado', ImagenPrincipal: 'img1.jpg' }
    ];

    service.getvehiculo().subscribe((vehiculos) => {
      expect(vehiculos).toEqual(mockVehiculos);
    });

    const req = httpMock.expectOne(`${apiUrl}/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockVehiculos);
  });


  it('debe agregar un vehículo (POST)', () => {
    const nuevoVehiculo: vehiculo = {
      Idvehiculo: 0, Marca: 'Nissan', Modelo: 'Versa', Ano: 2022,
      Kilometraje: 1000, Tipo: 'Carro', Descripcion: 'Nuevo', ImagenPrincipal: ''
    };

    service.postvehiculo(nuevoVehiculo).subscribe(response => {
      expect(response).toBeUndefined(); // Asumiendo que el post devuelve void
    });

    const req = httpMock.expectOne(`${apiUrl}/add`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nuevoVehiculo);
    req.flush(null);
  });

  it('debe actualizar un vehículo (PUT)', () => {
    const id = 1;
    const vehiculoEditado: vehiculo = {
      Idvehiculo: 1, Marca: 'Ford', Modelo: 'Fiesta', Ano: 2018,
      Kilometraje: 30000, Tipo: 'Carro', Descripcion: 'Económico', ImagenPrincipal: ''
    };

    service.putvehiculo(id, vehiculoEditado).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${apiUrl}/${id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(vehiculoEditado);
    req.flush(null);
  });

  it('debe eliminar un vehículo (DELETE)', () => {
    const id = 2;

    service.deletevehiculo(id).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${apiUrl}/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

});