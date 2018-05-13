import { TestBed, inject } from '@angular/core/testing';

import { AtractivoService } from './atractivo.service';

describe('AtractivoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AtractivoService]
    });
  });

  it('should be created', inject([AtractivoService], (service: AtractivoService) => {
    expect(service).toBeTruthy();
  }));
});
