import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { vehiculo } from '../models/vehiculo';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  apiBase='http://localhost:3000/api/';


  constructor(private _http:HttpClient) { 
    this.apiBase=environment.urlApiBase+'vehiculo';
  }

  getvehiculo(): Observable<vehiculo[]> {
    return this._http.get<vehiculo[]>(`${this.apiBase}/`);
}


  postvehiculo(nuevoVehiculo: vehiculo): Observable<void> {
    return this._http.post<void>(`${this.apiBase}/add`, nuevoVehiculo);
  }

  putvehiculo(id: number, vehiculoEditado: vehiculo): Observable<void> {
    return this._http.put<void>(`${this.apiBase}/${id}`, vehiculoEditado);
  }

  deletevehiculo(id: number): Observable<void> {
    return this._http.delete<void>(`${this.apiBase}/${id}`);
  }

}
