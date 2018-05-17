import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';

import { DOCUMENT, BrowserModule } from '@angular/platform-browser';
import { Injectable, Inject } from '@angular/core';


describe('AppComponent', () => {
  
 
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
       
      ],
      imports:[
        BrowserModule,
        RouterTestingModule.withRoutes([])
      ],
      providers:[]
    }).compileComponents();
  }));



});
