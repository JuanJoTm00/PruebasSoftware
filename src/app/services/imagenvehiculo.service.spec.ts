import { TestBed } from '@angular/core/testing';

import { ImagenvehiculoService } from './imagenvehiculo.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ImagenvehiculoService', () => {
  let service: ImagenvehiculoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule]
    });
    service = TestBed.inject(ImagenvehiculoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
