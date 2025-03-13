import { Component, Input } from '@angular/core';
import { vehiculo } from '../../models/vehiculo';

@Component({
  selector: 'app-cu-vehiculo',
  standalone: false,
  templateUrl: './cu-vehiculo.component.html',
  styleUrl: './cu-vehiculo.component.css'
})
export class CuVehiculoComponent {
@Input() vehiculo: vehiculo|undefined;
}
