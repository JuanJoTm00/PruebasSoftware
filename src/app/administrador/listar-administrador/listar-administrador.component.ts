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

  EditarAdministrador(administrador:administrador){
    this._util.AbrirModal(this.modal)
    this.isNew=false;
    this.administradorSeleccionado= administrador;
  }

  NuevoAdministrador(){
    this._util.AbrirModal(this.modal);
    this.isNew=true;
    this.administradorSeleccionado={Idadminstrador:0, Nombre:"",Email:"",Contrasena:""};
  }

  GuardarAdministrador() {
        if (this.administradorSeleccionado) {
          if (this.isNew) {
            // API POST para agregar nuevo vehículo
            this._administradorservice.postadministrador(this.administradorSeleccionado).subscribe(() => {
              Swal.fire({ title: 'Admin agregado correctamente', icon: 'success' });
              this.LoadAdministrador(); // Recargar lista
              this.administradorSeleccionado = undefined;
              this._util.CerrarModal(this.modal);
            }, error => {
              Swal.fire({ title: 'Error', text: error.message, icon: 'error' });
            });
          } else {
            // API PUT para actualizar vehículo existente
            this._administradorservice.putadministrador(this.administradorSeleccionado.Idadminstrador, this.administradorSeleccionado).subscribe(() => {
              Swal.fire({ title: 'Admin actualizado correctamente', icon: 'success' });
              this.LoadAdministrador(); // Recargar lista
              this.administradorSeleccionado = undefined;
              this._util.CerrarModal(this.modal);
            }, error => {
              Swal.fire({ title: 'Error', text: error.message, icon: 'error' });
            });
          }
        }
      }

  EliminarAdministrador(id: number) {
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
            this._administradorservice.deleteadministrador(id).subscribe(() => {
              Swal.fire({ title: 'Vehículo eliminado', icon: 'success' });
              this.LoadAdministrador(); // Recargar lista después de eliminar
            }, error => {
              Swal.fire({ title: 'Error al eliminar', text: error.message, icon: 'error' });
            });
          }
        });
      }


}
