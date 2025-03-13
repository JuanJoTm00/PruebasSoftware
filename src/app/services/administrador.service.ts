import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { administrador } from '../models/administrador';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdministradorService {
  apiBase='';

  constructor(private _http:HttpClient) { 
    this.apiBase=environment.urlApiBase+'administrador';
  }

  getAdministrador(): Observable<administrador[]>{
    return this._http.get<administrador[]>(this.apiBase + '/');
  }
  
}
