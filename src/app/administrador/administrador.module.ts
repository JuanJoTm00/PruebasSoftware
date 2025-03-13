import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarAdministradorComponent } from './listar-administrador/listar-administrador.component';
import { RouterModule, Routes } from '@angular/router';
import { CuAdministradorComponent } from './cu-administrador/cu-administrador.component';
import {FormsModule} from '@angular/forms'


const ROUTES : Routes =[
  {
    path:'',
    component: ListarAdministradorComponent 
  }

]



@NgModule({
  declarations: [
    ListarAdministradorComponent,
    CuAdministradorComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    FormsModule
  ]
})
export class AdministradorModule { }
