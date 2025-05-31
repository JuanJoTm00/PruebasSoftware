import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { VehiculoService } from '../services/vehiculo.service';
import { Modal } from 'bootstrap'; 
import { vehiculo } from '../models/vehiculo'; 

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  vehiculo: vehiculo[] = []; 
  vehiculoSeleccionado: vehiculo | undefined; 
  
  @ViewChild('vehiculoDetalleModal') modalElement: ElementRef | undefined; 
  public bsModal: Modal | undefined; 

  constructor(private vehiculoService: VehiculoService) {}

  ngOnInit(): void {
    this.cargarVehiculos();
  }


  ngAfterViewInit(): void {
      if (this.modalElement) {
          this.bsModal = new Modal(this.modalElement.nativeElement);
      }
  }

  cargarVehiculos(): void {
    this.vehiculoService.getvehiculo().subscribe(data => {
      this.vehiculo = data;
    }, error => {
      console.error('Error al obtener vehículos:', error);
    });
  }


  verDetalles(vehiculo: vehiculo): void {
    this.vehiculoSeleccionado = vehiculo; 
    if (this.bsModal) {
      this.bsModal.show();
    }
  }


  cerrarDetalles(): void {
    if (this.bsModal) {
      this.bsModal.hide(); 
    }
    this.vehiculoSeleccionado = undefined; 
  }
}