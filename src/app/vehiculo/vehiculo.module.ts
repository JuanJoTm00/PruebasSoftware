import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarVehiculoComponent } from './listar-vehiculo/listar-vehiculo.component';
import { CuVehiculoComponent } from './cu-vehiculo/cu-vehiculo.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

const ROUTES: Routes=[
{
  path:'',
  component:ListarVehiculoComponent
}
]

@NgModule({
  declarations: [
    ListarVehiculoComponent,
    CuVehiculoComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    FormsModule
  ]
})
export class VehiculoModule { }
