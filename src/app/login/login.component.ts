import { Component } from '@angular/core';
import { UtilityService } from '../services/utility.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  ad:string="";
  pwd:string="";

  constructor(private _utilService:UtilityService, private router:Router){

  }

  login(){
   this._utilService.login(this.ad,this.pwd)
   .subscribe(rs =>{
    if(rs){
      this.router.navigate(['/']);
    }else{
      Swal.fire({
        title:'Nombre o contraseña incorrectos',
        icon:'error'
      })
    }
   })
  }
}
