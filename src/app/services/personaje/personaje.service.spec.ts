import { TestBed, inject } from '@angular/core/testing';

import { PersonajeService } from './personaje.service';

describe('PersonajeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PersonajeService]
    });
  });

  it('should be created', inject([PersonajeService], (service: PersonajeService) => {
    expect(service).toBeTruthy();
  }));
});
