import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { imagenvehiculo } from '../models/imagenvehiculo';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImagenvehiculoService {
    private apiUrl = environment.urlApiBase + 'imagenvehiculo';

  constructor(private http: HttpClient) { }

  getImagenesPorVehiculo(idVehiculo: number): Observable<imagenvehiculo[]> {
    return this.http.get<imagenvehiculo[]>(`${this.apiUrl}/vehiculo/${idVehiculo}`);
  }

  agregarImagen(imagen: imagenvehiculo): Observable<imagenvehiculo> {
    return this.http.post<imagenvehiculo>(`${this.apiUrl}/add`, imagen);
  }


  eliminarImagen(idImagen: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idImagen}`);
  }
}
