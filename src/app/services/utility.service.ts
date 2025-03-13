import { ElementRef, Injectable } from '@angular/core';
import { Modal } from 'bootstrap';
import { Observable } from 'rxjs';
import { administrador } from '../models/administrador';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  private sessionkey = "UsuariokeySession";

  constructor() { }
  
  login(ad:string,pwd:string):Observable<boolean>{
    return new Observable(subs=>{
      let rs= ad== 'admin' && pwd=='admin';
      this.setSession(this.sessionkey,{Idadminstrador:1,Nombre:"Tuto",Email:"tuto@fgd.com",Contrasena:"1234"})
      subs.next(rs);
      subs.complete();
    })
  }

  getCurrenUser():administrador |undefined {
    return this.getSession<administrador>(this.sessionkey);

  }
  logout(){
    this.setSession(this.sessionkey,undefined);
  }

  isLoggedIn(): boolean{
    let usr=this.getSession(this.sessionkey);
    return (usr != undefined)
  }

getSession<T>(key:string){
let obj= sessionStorage.getItem(btoa(key));
if(obj)
  return JSON.parse(atob(obj)) as T;
else
return undefined
}

  setSession(key:string,value:any){
if(value)
  sessionStorage.setItem(btoa(key),btoa(JSON.stringify(value)));
else
sessionStorage.removeItem(key);
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
