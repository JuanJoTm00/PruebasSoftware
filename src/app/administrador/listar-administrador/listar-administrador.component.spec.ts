import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarAdministradorComponent } from './listar-administrador.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ListarAdministradorComponent', () => {
  let component: ListarAdministradorComponent;
  let fixture: ComponentFixture<ListarAdministradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarAdministradorComponent],
      imports:[HttpClientTestingModule]
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
