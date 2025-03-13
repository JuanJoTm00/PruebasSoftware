import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path:'home',
    component:HomeComponent
  },
  {
    path:'administrador',
    loadChildren:()=> import('./administrador/administrador.module').then(m=>m.AdministradorModule)
  },
  {
    path:'vehiculo',
    loadChildren:()=> import('./vehiculo/vehiculo.module').then(m=>m.VehiculoModule)
  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'**',redirectTo:'/home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
