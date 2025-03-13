import { Component, Input } from '@angular/core';
import { administrador } from '../../models/administrador';

@Component({
  selector: 'app-cu-administrador',
  standalone: false,
  templateUrl: './cu-administrador.component.html',
  styleUrl: './cu-administrador.component.css'
})
export class CuAdministradorComponent {
@Input() administrador: administrador|undefined;
}
