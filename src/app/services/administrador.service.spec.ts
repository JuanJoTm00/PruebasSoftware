import { TestBed } from '@angular/core/testing';

import { AdministradorService } from './administrador.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AdministradorService', () => {
  let service: AdministradorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule]
    });
    service = TestBed.inject(AdministradorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
