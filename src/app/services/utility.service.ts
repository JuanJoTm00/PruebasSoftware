import { ElementRef, Injectable } from '@angular/core';
import { Modal } from 'bootstrap';
import { Observable, of, BehaviorSubject } from 'rxjs'; 
import { administrador } from '../models/administrador';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  private sessionkey = "UsuariokeySession";
  private apiBase: string;


  private currentUserSubject: BehaviorSubject<administrador | undefined>;
 

  constructor(private http: HttpClient) {
    this.apiBase = environment.urlApiBase + 'administrador';

    this.currentUserSubject = new BehaviorSubject<administrador | undefined>(this.getSession<administrador>(this.sessionkey));
  }

  login(nombre: string, contrasena: string): Observable<boolean> {
    const loginPayload = { Nombre: nombre, Contrasena: contrasena };

    return this.http.post<administrador>(`${this.apiBase}/login`, loginPayload)
      .pipe(
        tap(admin => {
          if (admin) {
            this.setSession(this.sessionkey, admin);
            this.currentUserSubject.next(admin); 
          } else {
            this.setSession(this.sessionkey, undefined);
            this.currentUserSubject.next(undefined); 
          }
        }),
        map(admin => {
          return !!admin && !!admin.Idadminstrador;
        }),
        catchError(error => {
          console.error('Error en el login:', error);
          this.setSession(this.sessionkey, undefined);
          this.currentUserSubject.next(undefined); 
          return of(false);
        })
      );
  }

 
  getCurrenUser(): Observable<administrador | undefined> {
    return this.currentUserSubject.asObservable(); 
  }

  logout() {
    this.setSession(this.sessionkey, undefined);
    this.currentUserSubject.next(undefined); 
  }

  isLoggedIn(): boolean {
    let usr = this.getSession<administrador>(this.sessionkey); 
    return (usr !== undefined && usr !== null && !!usr.Idadminstrador); 
  }



  getSession<T>(key:string): T | undefined {
    try {
      let obj= sessionStorage.getItem(btoa(key));
      if(obj)
        return JSON.parse(atob(obj)) as T;
      else
      return undefined
    } catch (e) {
      console.error("Error al obtener sesión:", e);
      return undefined;
    }
  }

  setSession(key:string,value:any){
    try {
      if(value)
        sessionStorage.setItem(btoa(key),btoa(JSON.stringify(value)));
      else
        sessionStorage.removeItem(btoa(key)); 
    } catch (e) {
      console.error("Error al guardar sesión:", e);
    }
  }

  AbrirModal(modal:ElementRef | undefined){
    if(modal){
      let bsModal = Modal.getOrCreateInstance(modal.nativeElement);
      bsModal.show();
    }
  }

  CerrarModal(modal: ElementRef | undefined){
    if(modal){
      let bsModal = Modal.getInstance(modal?.nativeElement)
      bsModal?.hide();

      let backdrop = document.querySelector(".modal-backdrop.fade.show");
      if(backdrop){
        backdrop.parentNode?.removeChild(backdrop);
      }
      document.body.removeAttribute('style');
      document.body.removeAttribute('class');
    }
  }
}