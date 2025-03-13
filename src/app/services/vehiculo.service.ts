import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { vehiculo } from '../models/vehiculo';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  apiBase='';


  constructor(private _http:HttpClient) { 
    this.apiBase=environment.urlApiBase+'vehiculo';
  }

  getvehiculo(): Observable<vehiculo[]>{
    return this._http.get<vehiculo[]>(this.apiBase + '/');
  }
}
