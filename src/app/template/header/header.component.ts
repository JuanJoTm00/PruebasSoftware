import { Component, ElementRef, ViewChild } from '@angular/core';
import { administrador } from '../../models/administrador';
import { UtilityService } from '../../services/utility.service';
import { Router } from '@angular/router';
import { Dropdown } from 'bootstrap';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
@ViewChild("menudd") menudd: ElementRef | undefined;

openmenudd(){
  let dd = Dropdown.getOrCreateInstance(this.menudd?.nativeElement)
  dd.toggle
}

currentAdministrador: administrador |undefined;

constructor(private util:UtilityService,private router:Router){
  if(util.isLoggedIn())
   this.currentAdministrador=util.getCurrenUser();
  else
   this.router.navigate(["/login"])


}
}
