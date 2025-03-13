import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarAdministradorComponent } from './listar-administrador.component';

describe('ListarAdministradorComponent', () => {
  let component: ListarAdministradorComponent;
  let fixture: ComponentFixture<ListarAdministradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarAdministradorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarAdministradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
