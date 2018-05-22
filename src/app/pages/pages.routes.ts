import {URLSearchParams} from '@angular/http';
import { Routes, RouterModule } from "@angular/router";
import { PagesComponent } from "./pages.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProgressComponent } from "./progress/progress.component";
import { GraficasComponent } from "./graficas/graficas.component";
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { AuthGuard } from '../guards/auth.guard';
import { PerfilComponent } from './perfil/perfil.component';
import { AtractivoComponent } from './atractivo/atractivo/atractivo.component';
import { CrearAtractivoComponent } from './atractivo/crear-atractivo/crear-atractivo.component';
import { DetalleAtractivoComponent } from './atractivo/detalle-atractivo/detalle-atractivo.component';
import { NopagefoundComponent } from '../shared/nopagefound/nopagefound.component';

const pagesRoutes: Routes = [
    {
        path:'',
        component:PagesComponent,
        canActivate:[AuthGuard],
        children: [
            {path:'dashboard'  , component: DashboardComponent , data: {titulo: 'Dashboard'}},
            {path:'progress'  , component: ProgressComponent, data: {titulo: 'Barra de progreso'}},
            {path:'grafica'  , component: GraficasComponent, data: {titulo: 'Graficas'}},
            {path: 'accout-settings', component: AccountSettingsComponent, data: {titulo: 'Ajustes Tema'}},
            {path:'promesas'  , component: PromesasComponent, data: {titulo: 'Promesas'}},
            {path:'rxjs'  , component: RxjsComponent, data: {titulo: 'RXJS'}},
            {path:'perfil'  , component: PerfilComponent, data: {titulo: 'Perfil'}},
            {path:'atractivo'  , component: AtractivoComponent, data: {titulo: 'Atractivos'}},
            {path:'crear-atractivo'  , component: CrearAtractivoComponent, data: {titulo: 'Crear Atractivo'}},
            {path:'crear-atractivo/:id'  , component: CrearAtractivoComponent, data: {titulo: 'Editar Atractivo'}},
            {path: 'detalle-atractivo/:id', component: DetalleAtractivoComponent , data:{titulo: 'Detalle Atractivo'}},

            {path: '', redirectTo:'/dashboard',pathMatch:'full'}
        ],
        
        
        
    },          


       
] 
export const Pages_Routes = RouterModule.forChild(pagesRoutes);