import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleAtractivoComponent } from './detalle-atractivo.component';

describe('DetalleAtractivoComponent', () => {
  let component: DetalleAtractivoComponent;
  let fixture: ComponentFixture<DetalleAtractivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleAtractivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleAtractivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
