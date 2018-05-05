import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidebarService, SettingsService, SharedService} from './service.index';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers:[
    SidebarService,
    SettingsService,
    SharedService
  ]
})
export class ServiceModule { }
