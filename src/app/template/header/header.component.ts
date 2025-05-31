

import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from '../../services/utility.service';
import { Subscription } from 'rxjs';
import { administrador } from '../../models/administrador';
import { Offcanvas } from 'bootstrap'; 

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('offcanvasNavbar', {static:false}) offcanvasElement!: ElementRef;

  private offcanvasInstance: Offcanvas | undefined | null;

  isUserLoggedIn: boolean = false;
  currentUserName: string | null = null;
  public authSubscription: Subscription | undefined;

  constructor(
    private utilityService: UtilityService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authSubscription = this.utilityService.getCurrenUser().subscribe(admin => {
      this.isUserLoggedIn = !!admin;
      this.currentUserName = admin ? admin.Nombre : null;
    });
    this.checkLoginStatus();
  }

  ngAfterViewInit(): void {
    if (this.offcanvasElement && this.offcanvasElement.nativeElement) {


      setTimeout(() => {
        try {
          this.offcanvasInstance = Offcanvas.getInstance(this.offcanvasElement.nativeElement);

          if (!this.offcanvasInstance) {
            this.offcanvasInstance = new Offcanvas(this.offcanvasElement.nativeElement);
            
          } else {
          }

          if (this.offcanvasInstance) {
                     this.offcanvasElement.nativeElement.addEventListener('hidden.bs.offcanvas', this.cleanUpOffcanvasBackdropAndBody.bind(this));
            

      
            this.offcanvasElement.nativeElement.addEventListener('show.bs.offcanvas', () => console.log('Header DEBUG: Event: show.bs.offcanvas fired.'));
            this.offcanvasElement.nativeElement.addEventListener('shown.bs.offcanvas', () => console.log('Header DEBUG: Event: shown.bs.offcanvas fired.'));
            this.offcanvasElement.nativeElement.addEventListener('hide.bs.offcanvas', () => console.log('Header DEBUG: Event: hide.bs.offcanvas fired.'));

          } else {
            console.error('Header DEBUG: FAILED to create or retrieve Offcanvas instance.');
          }
        } catch (error) {
          console.error('Header DEBUG: Error during Offcanvas initialization:', error);
        }
      }, 0); 
    } else {
      console.error('Header DEBUG: offcanvasElement (DOM element) was NOT found in ngAfterViewInit!');
    }
  }

  ngOnDestroy(): void {
    console.log('Header DEBUG: ngOnDestroy - Cleaning up.');
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
   
    if (this.offcanvasElement && this.offcanvasInstance) {
      this.offcanvasElement.nativeElement.removeEventListener('hidden.bs.offcanvas', this.cleanUpOffcanvasBackdropAndBody.bind(this));
      this.offcanvasInstance.dispose(); 
      this.offcanvasInstance = undefined;
    }
    this.cleanUpOffcanvasBackdropAndBody();
  }

  private checkLoginStatus(): void {
    const admin = this.utilityService.getSession<administrador>(this.utilityService['sessionkey']);
    this.isUserLoggedIn = !!admin;
    this.currentUserName = admin ? admin.Nombre : null;
  }

  closeOffcanvas(): void {
    if (this.offcanvasInstance) {
      this.offcanvasInstance.hide();
    } else {
      const existingInstance = Offcanvas.getInstance(this.offcanvasElement?.nativeElement);
      if (existingInstance) {
        existingInstance.hide();
      } else {
      }
    }
  }

  logoutAndCloseOffcanvas(): void {
    this.utilityService.logout();
    this.closeOffcanvas();
    this.router.navigate(['/home']);
  }

  private cleanUpOffcanvasBackdropAndBody(): void {
    const backdrop = document.querySelector('.offcanvas-backdrop.fade.show') || document.querySelector('.offcanvas-backdrop');
    if (backdrop && backdrop.parentNode) {
      backdrop.parentNode.removeChild(backdrop);
    } else {
    }
    document.body.removeAttribute('style');
    document.body.removeAttribute('class');
  }
}