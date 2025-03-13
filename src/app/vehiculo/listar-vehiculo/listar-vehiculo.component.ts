import { Component, ElementRef, ViewChild } from '@angular/core';
import { vehiculo } from '../../models/vehiculo';
import { UtilityService } from '../../services/utility.service';
import { VehiculoService } from '../../services/vehiculo.service';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-listar-vehiculo',
  standalone: false,
  templateUrl: './listar-vehiculo.component.html',
  styleUrl: './listar-vehiculo.component.css'
})
export class ListarVehiculoComponent {
   @ViewChild('modalAdministrador') modal:ElementRef | undefined;
  
    Vectorvehiculo: vehiculo[]=[
      
    ];
    constructor(private _vehiculoservice:VehiculoService,private _util:UtilityService){
     this.Loadvehiculo();
    }
    Loadvehiculo(){
      this.isloading=true;
      this._vehiculoservice.getvehiculo()
      .subscribe((rs)=>{
        this.Vectorvehiculo=rs;
        this.isloading=false;
       });
      
    }
  
    vehiculoSeleccionado: vehiculo | undefined = undefined;
    isNew:boolean= false;
  
    isloading=true;
  
    Editarvehiculo(vehiculo:vehiculo){
      this._util.AbrirModal(this.modal)
      this.isNew=false;
      this.vehiculoSeleccionado= vehiculo;
    }
  
    Nuevovehiculo(){
      this._util.AbrirModal(this.modal);
      this.isNew=true;
      this.vehiculoSeleccionado={Idvehiculo:0, Marca:"",Modelo:"",Ano:0,Kilometraje:0,Tipo:"Carro",Descripcion:"",ImagenPrincipal:""};
    }
  
    Guardarvehiculo(){
      if(this.isNew){
        this.Vectorvehiculo.push(this.vehiculoSeleccionado!); //API POST
        this.vehiculoSeleccionado=undefined;
        this._util.CerrarModal(this.modal)
      }else{
        //API PUT
        this.vehiculoSeleccionado=undefined;
        this._util.CerrarModal(this.modal)
      }
      Swal.fire({title:'Cambios guardados corectamente', icon:'success'})
    }
    Eliminarvehiculo(ad:vehiculo){
      Swal.fire(
        {
          icon:'question',
          title:`¿Está seguro de eliminar?`,
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
