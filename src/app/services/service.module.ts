import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarService, SettingsService, SharedService, AuthService , UsuarioService, ArchivoService, AtractivoService} from './service.index';
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers:[
    
    SidebarService,
    SettingsService,
    SharedService,
    AuthService,
    UsuarioService,
    ArchivoService,
    AtractivoService
  ]
})
export class ServiceModule { }
