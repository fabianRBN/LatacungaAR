import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  SidebarService,
  SettingsService,
  SharedService,
  AuthService,
  UsuarioService,
  ArchivoService,
  AtractivoService,
  ServicioService,
  PersonajeService,
  GeoAtractivoService,
  ComentariosService,
  ClienteService,
  AreaPeligrosaService
} from './service.index';

@NgModule({
  imports: [CommonModule],
  declarations: [],
  providers: [
    SidebarService,
    SettingsService,
    SharedService,
    AuthService,
    UsuarioService,
    ArchivoService,
    AtractivoService,
    ServicioService,
    PersonajeService,
    GeoAtractivoService,
    ComentariosService,
    ClienteService,
    AreaPeligrosaService
  ]
})
export class ServiceModule {}
