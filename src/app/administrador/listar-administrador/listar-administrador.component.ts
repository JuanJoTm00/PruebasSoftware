import { Component, ElementRef, ViewChild } from '@angular/core';
import { administrador } from '../../models/administrador';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
import { AdministradorService } from '../../services/administrador.service';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-listar-administrador',
  standalone: false,
  templateUrl: './listar-administrador.component.html',
  styleUrl: './listar-administrador.component.css'
})
export class ListarAdministradorComponent {
  @ViewChild('modalAdministrador') modal:ElementRef | undefined;

  Vectoradministrador: administrador[]=[
    
  ];
  constructor(private _administradorservice:AdministradorService,private _util:UtilityService){
   this.LoadAdministrador();
  }
  LoadAdministrador(){
    this.isloading=true;
    this._administradorservice.getAdministrador()
    .subscribe((rs)=>{
     this.Vectoradministrador =rs;
     this.isloading=false;
    });
  }

  administradorSeleccionado: administrador | undefined = undefined;
  isNew:boolean= false;

  isloading=true;

  EditarAdminstrador(administrador:administrador){
    this._util.AbrirModal(this.modal)
    this.isNew=false;
    this.administradorSeleccionado= administrador;
  }

  NuevoAdministrador(){
    this._util.AbrirModal(this.modal);
    this.isNew=true;
    this.administradorSeleccionado={Idadminstrador:0, Nombre:"",Email:"",Contrasena:""};
  }

  GuardarAdministrador(){
    if(this.isNew){
      this.Vectoradministrador.push(this.administradorSeleccionado!); //API POST
      this.administradorSeleccionado=undefined;
      this._util.CerrarModal(this.modal)
    }else{
      //API PUT
      this.administradorSeleccionado=undefined;
      this._util.CerrarModal(this.modal)
    }
    Swal.fire({title:'Cambios guardados corectamente', icon:'success'})
  }
  EliminarAdministrador(ad:administrador){
    Swal.fire(
      {
        icon:'question',
        title:`¿Está seguro de eliminar '${ad.Nombre}'?`,
        showCancelButton:true,
        showConfirmButton:true,
        cancelButtonText:'No',
        confirmButtonText:'Sí',
        allowOutsideClick:false,
        buttonsStyling:false,
        reverseButtons:true,
        
        customClass:{
          cancelButton:'btn btn-secondary me-2',
          confirmButton:'btn btn-danger',

        }
      }
    )
    .then(rs=>{
      if(rs.isConfirmed){
        //llamda api
        Swal.fire({
          title: 'Eliminado Correctamente',
          icon: 'success'
        })
      }
    })
  }


}
