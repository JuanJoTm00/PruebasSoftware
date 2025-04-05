import { Component, ElementRef, ViewChild } from '@angular/core';
import { vehiculo } from '../../models/vehiculo';
import { UtilityService } from '../../services/utility.service';
import { VehiculoService } from '../../services/vehiculo.service';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';
import { Title } from '@angular/platform-browser';
import { ImagenvehiculoService } from '../../services/imagenvehiculo.service';
import { imagenvehiculo } from '../../models/imagenvehiculo';

@Component({
  selector: 'app-listar-vehiculo',
  standalone: false,
  templateUrl: './listar-vehiculo.component.html',
  styleUrl: './listar-vehiculo.component.css'
})
export class ListarVehiculoComponent {
   @ViewChild('modalVehiculo') modal:ElementRef | undefined;
  
    Vectorvehiculo: vehiculo[]=[
      
    ];
    constructor(
      private _vehiculoservice:VehiculoService,
      private _imagenvehiculoservice: ImagenvehiculoService,
      private _util:UtilityService
    )
    
    {
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
      this._imagenvehiculoservice.getImagenesPorVehiculo(vehiculo.Idvehiculo).subscribe((imagenes) => {
      this.vehiculoSeleccionado!.Imagenes = imagenes;
    });
    }
  
    Nuevovehiculo(){
      this._util.AbrirModal(this.modal);
      this.isNew=true;
      this.vehiculoSeleccionado={Idvehiculo:0, Marca:"",Modelo:"",Ano:0,Kilometraje:0,Tipo:"Carro",Descripcion:"",ImagenPrincipal:"",Imagenes:[]};
    }
  
    Guardarvehiculo() {
      if (this.vehiculoSeleccionado) {
        if (this.isNew) {
          this._vehiculoservice.postvehiculo(this.vehiculoSeleccionado).subscribe(() => {
            Swal.fire({ title: 'Vehículo agregado correctamente', icon: 'success' });
            this.Loadvehiculo(); // Recargar lista
            this.vehiculoSeleccionado = undefined;
            this._util.CerrarModal(this.modal);
          }, error => {
            Swal.fire({ title: 'Error al agregar vehículo', text: error.message, icon: 'error' });
          });
        } else {
          this._vehiculoservice.putvehiculo(this.vehiculoSeleccionado.Idvehiculo, this.vehiculoSeleccionado).subscribe(() => {
            Swal.fire({ title: 'Vehículo actualizado correctamente', icon: 'success' });
            this.Loadvehiculo(); 
            this.vehiculoSeleccionado = undefined;
            this._util.CerrarModal(this.modal);
          }, error => {
            Swal.fire({ title: 'Error al actualizar vehículo', text: error.message, icon: 'error' });
          });
        }
      }
    }

    Eliminarvehiculo(id: number) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás revertir esta acción',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this._vehiculoservice.deletevehiculo(id).subscribe(() => {
            Swal.fire({ title: 'Vehículo eliminado', icon: 'success' });
            this.Loadvehiculo(); 
          }, error => {
            Swal.fire({ title: 'Error al eliminar', text: error.message, icon: 'error' });
          });
        }
      });
    }

    AgregarImagenVehiculo(url: string) {
      if (!this.vehiculoSeleccionado) return;
  
      const nuevaImagen: imagenvehiculo = {
        Idimagen: 0,
        Idvehiculo: this.vehiculoSeleccionado.Idvehiculo,
        UrlImagen: url
      };
  
      this._imagenvehiculoservice.agregarImagen(nuevaImagen).subscribe(() => {
        this.vehiculoSeleccionado!.Imagenes!.push(nuevaImagen);
        Swal.fire({ title: 'Imagen añadida', icon: 'success' });
      });
    }

    EliminarImagenVehiculo(Idimagen: number) {
      this._imagenvehiculoservice.eliminarImagen(Idimagen).subscribe(() => {
        this.vehiculoSeleccionado!.Imagenes = this.vehiculoSeleccionado!.Imagenes!.filter(img => img.Idimagen !== Idimagen);
        Swal.fire({ title: 'Imagen eliminada', icon: 'success' });
      });
    }

}
