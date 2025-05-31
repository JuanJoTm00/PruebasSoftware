import { TestBed } from '@angular/core/testing';
import { ImagenvehiculoService } from './imagenvehiculo.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { imagenvehiculo } from '../models/imagenvehiculo'; 

describe('ImagenvehiculoService', () => {
  let service: ImagenvehiculoService;
  let httpMock: HttpTestingController;

  const apiUrl = environment.urlApiBase + 'imagenvehiculo';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      providers: [ImagenvehiculoService] 
    });


    service = TestBed.inject(ImagenvehiculoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {

    httpMock.verify();
  });

  it('debe ser creado', () => {
    expect(service).toBeTruthy();
  });


  it('debe obtener imágenes de un vehículo específico por ID (GET)', () => {
    const mockImagenes: imagenvehiculo[] = [
      { IdImagen: 1, UrlImagen: 'https://example.com/img1.jpg', IdVehiculo: 101 },
      { IdImagen: 2, UrlImagen: 'https://example.com/img2.jpg', IdVehiculo: 101 }
    ];
    const vehiculoId = 101;

    service.getImagenesPorVehiculo(vehiculoId).subscribe(imagenes => {
      expect(imagenes).toEqual(mockImagenes); 
    });


    const req = httpMock.expectOne(`${apiUrl}/vehiculo/${vehiculoId}`);
    expect(req.request.method).toBe('GET'); 
    req.flush(mockImagenes); 
  });



  it('debe agregar una nueva imagen (POST)', () => {
    const newImage: imagenvehiculo = { IdImagen: 0, UrlImagen: 'https://example.com/new_img.jpg', IdVehiculo: 102 };

    const mockResponse: imagenvehiculo = { ...newImage, IdImagen: 3 };

    service.agregarImagen(newImage).subscribe(response => {
      expect(response).toEqual(mockResponse); 
    });

    const req = httpMock.expectOne(`${apiUrl}/add`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newImage); 
    req.flush(mockResponse); 
  });



 
  it('debe eliminar una imagen por ID (DELETE)', () => {
    const imagenId = 5;

    service.eliminarImagen(imagenId).subscribe(response => {
      expect(response).toBeUndefined(); 
    });

    const req = httpMock.expectOne(`${apiUrl}/${imagenId}`);
    expect(req.request.method).toBe('DELETE'); 
    req.flush(null); 
  });


});