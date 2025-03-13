import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuAdministradorComponent } from './cu-administrador.component';

describe('CuAdministradorComponent', () => {
  let component: CuAdministradorComponent;
  let fixture: ComponentFixture<CuAdministradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CuAdministradorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuAdministradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
