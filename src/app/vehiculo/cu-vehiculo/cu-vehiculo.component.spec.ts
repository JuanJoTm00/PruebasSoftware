import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CuVehiculoComponent } from './cu-vehiculo.component';
import { FormsModule } from '@angular/forms';
import { vehiculo } from '../../models/vehiculo';
import { imagenvehiculo } from '../../models/imagenvehiculo';

describe('CuVehiculoComponent', () => {
  let component: CuVehiculoComponent;
  let fixture: ComponentFixture<CuVehiculoComponent>;

  const mockVehiculo: vehiculo = {
    Idvehiculo: 1,
    Marca: 'Toyota',
    Modelo: 'Corolla',
    Ano: 2020,
    Kilometraje: 50000,
    Tipo: 'Carro',
    Descripcion: 'Buen estado',
    ImagenPrincipal: 'https://example.com/corolla.jpg',
    Imagenes: [
      { IdImagen: 101, UrlImagen: 'https://example.com/corolla_interior.jpg', IdVehiculo: 1 },
      { IdImagen: 102, UrlImagen: 'https://example.com/corolla_exterior.jpg', IdVehiculo: 1 }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CuVehiculoComponent],
      imports: [FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CuVehiculoComponent);
    component = fixture.componentInstance;
    component.vehiculo = mockVehiculo;
    fixture.detectChanges();
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debe recibir y mostrar los datos del vehículo a través del @Input', () => {
    fixture.detectChanges(); // refrescar DOM

    const compiled = fixture.nativeElement as HTMLElement;

    const inputMarca: HTMLInputElement = compiled.querySelector('#Marca')!;
    expect(inputMarca.value).toBe('Toyota');

    const inputModelo: HTMLInputElement = compiled.querySelector('#Modelo')!;
    expect(inputModelo.value).toBe('Corolla');

    const inputAno: HTMLInputElement = compiled.querySelector('#Ano')!;
    expect(inputAno.value).toBe('2020');

    const inputDescripcion: HTMLInputElement = compiled.querySelector('#Descripcion')!;
    expect(inputDescripcion.value).toBe('Buen estado');
  });

  it('debe emitir onAgregarImagen con la URL si es válida y hay vehículo', () => {
    const spyEmit = jest.spyOn(component.onAgregarImagen, 'emit');
    component.nuevaImagenUrl = 'https://example.com/new.jpg';
    component.agregarImagen();
    expect(spyEmit).toHaveBeenCalledWith('https://example.com/new.jpg');
    expect(component.nuevaImagenUrl).toBe('');
  });

  it('no debe emitir onAgregarImagen si nuevaImagenUrl está vacía', () => {
    const spyEmit = jest.spyOn(component.onAgregarImagen, 'emit');
    component.nuevaImagenUrl = '';
    component.agregarImagen();
    expect(spyEmit).not.toHaveBeenCalled();
  });

  it('no debe emitir onAgregarImagen si vehiculo es undefined', () => {
    const spyEmit = jest.spyOn(component.onAgregarImagen, 'emit');
    component.vehiculo = undefined;
    component.nuevaImagenUrl = 'https://example.com/img.jpg';
    component.agregarImagen();
    expect(spyEmit).not.toHaveBeenCalled();
  });

  it('debe emitir onEliminarImagen con el ID si hay vehículo', () => {
    const spyEmit = jest.spyOn(component.onEliminarImagen, 'emit');
    component.eliminarImagen(101);
    expect(spyEmit).toHaveBeenCalledWith(101);
  });

  it('no debe emitir onEliminarImagen si vehiculo es undefined', () => {
    const spyEmit = jest.spyOn(component.onEliminarImagen, 'emit');
    component.vehiculo = undefined;
    component.eliminarImagen(101);
    expect(spyEmit).not.toHaveBeenCalled();
  });

});
