import { Component, Input, Output, EventEmitter } from '@angular/core'; 
import { vehiculo } from '../../models/vehiculo';
import { imagenvehiculo } from '../../models/imagenvehiculo'; 

@Component({
  selector: 'app-cu-vehiculo',
  standalone: false,
  templateUrl: './cu-vehiculo.component.html',
  styleUrl: './cu-vehiculo.component.css' 
})
export class CuVehiculoComponent {
  @Input() vehiculo: vehiculo | undefined;
  @Output() onAgregarImagen = new EventEmitter<string>(); 
  @Output() onEliminarImagen = new EventEmitter<number>(); 
  @Input() imagenesAdicionales: imagenvehiculo[] = [];

  nuevaImagenUrl: string = ''; 

  agregarImagen() {
    if (this.nuevaImagenUrl && this.vehiculo) {
      this.onAgregarImagen.emit(this.nuevaImagenUrl);
      this.nuevaImagenUrl = ''; 
    }
  }

  eliminarImagen(idImagen: number) {
    if (this.vehiculo) {
      this.onEliminarImagen.emit(idImagen);
    }
  }
}