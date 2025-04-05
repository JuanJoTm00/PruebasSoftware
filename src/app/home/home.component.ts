import { Component, OnInit } from '@angular/core';
import { VehiculoService } from '../services/vehiculo.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
vehiculo: any[]=[];
constructor(private vehiculoService: VehiculoService) {}

  ngOnInit(): void {
    this.cargarVehiculos();
  }

  cargarVehiculos(): void {
    this.vehiculoService.getvehiculo().subscribe(data => {
      this.vehiculo = data;
    }, error => {
      console.error('Error al obtener vehículos:', error);
    });
  }

}
