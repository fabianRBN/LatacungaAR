import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtractivoComponent } from './atractivo.component';

describe('AtractivoComponent', () => {
  let component: AtractivoComponent;
  let fixture: ComponentFixture<AtractivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtractivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtractivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
