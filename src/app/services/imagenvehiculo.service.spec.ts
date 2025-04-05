import { TestBed } from '@angular/core/testing';

import { ImagenvehiculoService } from './imagenvehiculo.service';

describe('ImagenvehiculoService', () => {
  let service: ImagenvehiculoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImagenvehiculoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
