import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { vehiculo } from '../../models/vehiculo'; 
import { imagenvehiculo } from '../../models/imagenvehiculo'; 
import { ImagenvehiculoService } from '../../services/imagenvehiculo.service'; 

@Component({
  selector: 'app-detalle-vehiculo-modal',
  templateUrl: './detalle-vehiculo-modal.component.html',
  styleUrl: './detalle-vehiculo-modal.component.css',
  standalone: false 
})
export class DetalleVehiculoModalComponent implements OnInit, OnChanges {
  @Input() vehiculoDetalle: vehiculo | undefined; 
  @Output() cerrarModal = new EventEmitter<void>(); 

  imagenesAdicionales: imagenvehiculo[] = []; 

  constructor(private imagenVehiculoService: ImagenvehiculoService) {}

  ngOnInit(): void {
    if (this.vehiculoDetalle) {
      this.cargarImagenesVehiculo(this.vehiculoDetalle.Idvehiculo);
    }
  }

  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['vehiculoDetalle'] && changes['vehiculoDetalle'].currentValue) {
      this.cargarImagenesVehiculo(this.vehiculoDetalle!.Idvehiculo);
    } else if (changes['vehiculoDetalle'] && !changes['vehiculoDetalle'].currentValue) {
      this.imagenesAdicionales = [];
    }
  }

  cargarImagenesVehiculo(idVehiculo: number): void {
    this.imagenVehiculoService.getImagenesPorVehiculo(idVehiculo).subscribe({
      next: (data) => {
        let todasLasImagenes: imagenvehiculo[] = [];
        if (this.vehiculoDetalle?.ImagenPrincipal) {
          todasLasImagenes.push({
            IdImagen: 0, 
            IdVehiculo: this.vehiculoDetalle.Idvehiculo,
            UrlImagen: this.vehiculoDetalle.ImagenPrincipal
          });
        }
        this.imagenesAdicionales = todasLasImagenes.concat(data); 
      },
      error: (error) => {
        console.error('Error al cargar imágenes adicionales del vehículo:', error);
        this.imagenesAdicionales = []; 
      }
    });
  }

  cerrar(): void {
    this.cerrarModal.emit(); 
  }
}
