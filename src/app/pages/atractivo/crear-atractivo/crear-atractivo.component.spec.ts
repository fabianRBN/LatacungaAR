import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearAtractivoComponent } from './crear-atractivo.component';

describe('CrearAtractivoComponent', () => {
  let component: CrearAtractivoComponent;
  let fixture: ComponentFixture<CrearAtractivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearAtractivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearAtractivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
