import { TestBed } from '@angular/core/testing';
import { ImagenvehiculoService } from './imagenvehiculo.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { imagenvehiculo } from '../models/imagenvehiculo'; // Asegúrate de tener este modelo

describe('ImagenvehiculoService', () => {
  let service: ImagenvehiculoService;
  let httpMock: HttpTestingController;
  // La URL base para el servicio de imagenvehiculo
  const apiUrl = environment.urlApiBase + 'imagenvehiculo';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Importa esto para simular llamadas HTTP
      providers: [ImagenvehiculoService] // Provee el servicio que vamos a probar
    });

    // Inyecta el servicio y el controlador de mock HTTP
    service = TestBed.inject(ImagenvehiculoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Después de cada prueba, verifica que no queden solicitudes HTTP pendientes
    httpMock.verify();
  });

  it('debe ser creado', () => {
    expect(service).toBeTruthy();
  });

  // --- Pruebas para getImagenesPorVehiculo ---
  it('debe obtener imágenes de un vehículo específico por ID (GET)', () => {
    const mockImagenes: imagenvehiculo[] = [
      { IdImagen: 1, UrlImagen: 'https://example.com/img1.jpg', IdVehiculo: 101 },
      { IdImagen: 2, UrlImagen: 'https://example.com/img2.jpg', IdVehiculo: 101 }
    ];
    const vehiculoId = 101;

    // Suscribe al observable para esperar la respuesta
    service.getImagenesPorVehiculo(vehiculoId).subscribe(imagenes => {
      expect(imagenes).toEqual(mockImagenes); // Verifica que los datos recibidos son los esperados
    });

    // Espera una única solicitud GET a la URL esperada
    const req = httpMock.expectOne(`${apiUrl}/vehiculo/${vehiculoId}`);
    expect(req.request.method).toBe('GET'); // Confirma que el método HTTP es GET
    req.flush(mockImagenes); // Simula la respuesta de la API con los datos mockeados
  });


  // --- Pruebas para agregarImagen ---
  it('debe agregar una nueva imagen (POST)', () => {
    const newImage: imagenvehiculo = { IdImagen: 0, UrlImagen: 'https://example.com/new_img.jpg', IdVehiculo: 102 };
    // Asumiendo que la API devuelve la imagen agregada con su nuevo ID
    const mockResponse: imagenvehiculo = { ...newImage, IdImagen: 3 };

    service.agregarImagen(newImage).subscribe(response => {
      expect(response).toEqual(mockResponse); // Verifica que la respuesta es la imagen con el nuevo ID
    });

    const req = httpMock.expectOne(`${apiUrl}/add`);
    expect(req.request.method).toBe('POST'); // Confirma que el método HTTP es POST
    expect(req.request.body).toEqual(newImage); // Confirma que el cuerpo de la solicitud es la nueva imagen
    req.flush(mockResponse); // Simula la respuesta de la API
  });



  // --- Pruebas para eliminarImagen ---
  it('debe eliminar una imagen por ID (DELETE)', () => {
    const imagenId = 5;

    service.eliminarImagen(imagenId).subscribe(response => {
      expect(response).toBeUndefined(); // Para 'void' o 204 No Content, la respuesta es undefined
    });

    const req = httpMock.expectOne(`${apiUrl}/${imagenId}`);
    expect(req.request.method).toBe('DELETE'); // Confirma que el método HTTP es DELETE
    req.flush(null); // Simula una respuesta exitosa sin contenido (204 No Content)
  });


});