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

  Vectorvehiculo: vehiculo[] = [];
  vehiculoSeleccionado: vehiculo | undefined = undefined;
  isNew:boolean = false;
  isloading:boolean = true; 

  constructor(
    private _vehiculoservice:VehiculoService,
    private _imagenvehiculoservice: ImagenvehiculoService,
    private _util:UtilityService
  ) {
    this.Loadvehiculo();
  }

  Loadvehiculo(){
    this.isloading = true;
    this._vehiculoservice.getvehiculo()
      .subscribe({
        next: (rs) => {
          this.Vectorvehiculo = rs;
          this.isloading = false;
        },
        error: (e) => {
          console.error("Error al cargar vehículos:", e);
          this.isloading = false;
          Swal.fire({ title: 'Error', text: 'No se pudieron cargar los vehículos', icon: 'error' });
        }
      });
  }

Editarvehiculo(vehiculo: vehiculo) {
  this._util.AbrirModal(this.modal);
  this.isNew = false;
  this.vehiculoSeleccionado = { ...vehiculo }; 
  if (!this.vehiculoSeleccionado.Imagenes) {
      this.vehiculoSeleccionado.Imagenes = []; 
  }

  this._imagenvehiculoservice.getImagenesPorVehiculo(vehiculo.Idvehiculo).subscribe({
      next: (imagenes) => {
          this.vehiculoSeleccionado!.Imagenes = imagenes;
      },
      error: (e) => {
          console.error("Error al cargar imágenes del vehículo:", e);
          Swal.fire({ title: 'Error', text: 'No se pudieron cargar las imágenes del vehículo', icon: 'error' });
      }
  });
}

  Nuevovehiculo(){
    this._util.AbrirModal(this.modal);
    this.isNew = true;
    this.vehiculoSeleccionado = {Idvehiculo:0, Marca:"",Modelo:"",Ano:0,Kilometraje:0,Tipo:"Carro",Descripcion:"",ImagenPrincipal:"",Imagenes:[]};
  }

  Guardarvehiculo() {
  if (!this.vehiculoSeleccionado) return;

  if (this.isNew) {
    this._vehiculoservice.postvehiculo(this.vehiculoSeleccionado).subscribe({
      next: (response) => {
        this.Loadvehiculo(); 
        setTimeout(() => {
          const vehiculoRecienCreado = this.Vectorvehiculo.find(v => v.Marca === this.vehiculoSeleccionado!.Marca && v.Modelo === this.vehiculoSeleccionado!.Modelo); // Buscar por propiedades
          if (vehiculoRecienCreado && this.vehiculoSeleccionado!.Imagenes) {
            this.vehiculoSeleccionado!.Imagenes.forEach(img => {
              if (img.IdImagen=== 0) { 
                const imagenParaGuardar: imagenvehiculo = {
                  IdImagen: 0,
                  IdVehiculo: vehiculoRecienCreado.Idvehiculo,
                  UrlImagen: img.UrlImagen
                };
                this._imagenvehiculoservice.agregarImagen(imagenParaGuardar).subscribe({
                  next: (savedImg) => {
                    const index = this.vehiculoSeleccionado!.Imagenes!.findIndex(i => i.UrlImagen === img.UrlImagen && i.IdImagen === 0);
                    if (index !== -1) {
                      this.vehiculoSeleccionado!.Imagenes![index] = savedImg;
                    }
                  },
                  error: (e) => console.error("Error al guardar imagen de nuevo vehículo:", e)
                });
              }
            });
          }
          Swal.fire({ title: 'Vehículo agregado correctamente', icon: 'success' });
          this.vehiculoSeleccionado = undefined;
          this._util.CerrarModal(this.modal);
        }, 500); 
      },
      error: (error) => {
        Swal.fire({ title: 'Error al agregar vehículo', text: error.message, icon: 'error' });
      }
    });
  } else {
    this._vehiculoservice.putvehiculo(this.vehiculoSeleccionado.Idvehiculo, this.vehiculoSeleccionado).subscribe({
      next: () => {
        Swal.fire({ title: 'Vehículo actualizado correctamente', icon: 'success' });
        this.Loadvehiculo();
        this.vehiculoSeleccionado = undefined;
        this._util.CerrarModal(this.modal);
      },
      error: (error) => {
        Swal.fire({ title: 'Error al actualizar vehículo', text: error.message, icon: 'error' });
      }
    });
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
        this._vehiculoservice.deletevehiculo(id).subscribe({
          next: () => {
            Swal.fire({ title: 'Vehículo eliminado', icon: 'success' });
            this.Loadvehiculo();
          },
          error: (error) => {
            Swal.fire({ title: 'Error al eliminar', text: error.message, icon: 'error' });
          }
        });
      }
    });
  }

  AgregarImagenVehiculo(url: string) {
    if (!this.vehiculoSeleccionado || !url) {
      Swal.fire({ title: 'Advertencia', text: 'URL de imagen inválida o vehículo no seleccionado.', icon: 'warning' });
      return;
    }
    if (this.vehiculoSeleccionado.Idvehiculo === 0) {
      if (!this.vehiculoSeleccionado.Imagenes) {
        this.vehiculoSeleccionado.Imagenes = [];
      }
      this.vehiculoSeleccionado.Imagenes.push({
        IdImagen: 0, 
        IdVehiculo: 0,
        UrlImagen: url
      });
      Swal.fire({ title: 'Imagen añadida localmente', text: 'Se guardará con el vehículo.', icon: 'info' });
      return;
    }

    const nuevaImagen: imagenvehiculo = {
      IdImagen: 0, 
      IdVehiculo: this.vehiculoSeleccionado.Idvehiculo,
      UrlImagen: url
    };


    this._imagenvehiculoservice.agregarImagen(nuevaImagen).subscribe({
      next: (imagenGuardada) => {
        if (!this.vehiculoSeleccionado!.Imagenes) {
          this.vehiculoSeleccionado!.Imagenes = [];
        }
       
        this.vehiculoSeleccionado!.Imagenes.push(imagenGuardada);
        Swal.fire({ title: 'Imagen añadida correctamente', icon: 'success' });
      },
      error: (e) => {
        console.error("Error al añadir imagen:", e);
        Swal.fire({ title: 'Error', text: 'No se pudo añadir la imagen.', icon: 'error' });
      }
    });
  }

  EliminarImagenVehiculo(Idimagen: number) {
    if (!this.vehiculoSeleccionado || !this.vehiculoSeleccionado.Imagenes) return;

    if (Idimagen === 0) {
      this.vehiculoSeleccionado.Imagenes = this.vehiculoSeleccionado.Imagenes.filter(img => img.IdImagen !== 0 || img.UrlImagen !== this.vehiculoSeleccionado!.Imagenes!.find(i => i.IdImagen === 0 && i.UrlImagen === 'URL_TEMPORAL_A_ELIMINAR_SI_HAY_VARIAS_CON_ID_0')?.UrlImagen);
      Swal.fire({ title: 'Imagen eliminada localmente', icon: 'info' });
      return;
    }

    Swal.fire({
      title: '¿Estás seguro de eliminar esta imagen?',
      text: 'Esta acción no se puede revertir.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._imagenvehiculoservice.eliminarImagen(Idimagen).subscribe({
          next: () => {
            this.vehiculoSeleccionado!.Imagenes = this.vehiculoSeleccionado!.Imagenes!.filter(img => img.IdImagen !== Idimagen);
            Swal.fire({ title: 'Imagen eliminada correctamente', icon: 'success' });
          },
          error: (e) => {
            console.error("Error al eliminar imagen:", e);
            Swal.fire({ title: 'Error', text: 'No se pudo eliminar la imagen.', icon: 'error' });
          }
        });
      }
    });
  }
}