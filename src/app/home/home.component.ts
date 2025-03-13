import { Component } from '@angular/core';
import { vehiculo } from '../models/vehiculo';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
vehiculo: vehiculo | undefined;

}
