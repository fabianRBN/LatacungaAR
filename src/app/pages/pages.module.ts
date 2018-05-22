import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { SharedModule } from '../shared/shared.module';
import { GraficasComponent } from './graficas/graficas.component';
import { Pages_Routes } from './pages.routes';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { IncrementadorComponent } from '../components/incrementador/incrementador.component';
import { ChartsModule } from 'ng2-charts';
import { GraficoDonaComponent } from '../components/grafico-dona/grafico-dona.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { AuthGuard } from '../guards/auth.guard';
import { PerfilComponent } from './perfil/perfil.component';
import { CommonModule } from "@angular/common";
import { AtractivoComponent } from './atractivo/atractivo/atractivo.component';
import { CrearAtractivoComponent } from './atractivo/crear-atractivo/crear-atractivo.component';
import { AgmCoreModule } from '@agm/core';
import { ImagenPipe } from '../pipe/imagen.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { DetalleAtractivoComponent } from './atractivo/detalle-atractivo/detalle-atractivo.component';
import { MainPipe } from '../main-pipe.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({


  declarations: [
    PagesComponent,
    DashboardComponent,
    ProgressComponent,
    GraficasComponent,
    IncrementadorComponent,
    GraficoDonaComponent,
    AccountSettingsComponent,
    PromesasComponent,
    RxjsComponent,
    PerfilComponent,
    AtractivoComponent,
    CrearAtractivoComponent,
    ImagenPipe,
    
    DetalleAtractivoComponent,
    
    
    
  ],
  exports:[
    
    DashboardComponent,
    ProgressComponent,
    GraficasComponent
    
  ],
  imports:[
    NgbModule,
    MainPipe,
    SharedModule,
    Pages_Routes,
    FormsModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    ChartsModule,
    CommonModule,
    AgmCoreModule
  ],
  providers:[
    AuthGuard
  ],

  
})
export class PagesModule { }
