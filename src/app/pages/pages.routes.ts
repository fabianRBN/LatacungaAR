import {URLSearchParams} from '@angular/http';
import { Routes, RouterModule } from "@angular/router";
import { PagesComponent } from "./pages.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProgressComponent } from "./progress/progress.component";
import { Graficas1Component } from "./graficas1/graficas1.component";
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';

const pagesRoutes: Routes = [
    {
        path:'',
        component:PagesComponent,
        children: [
            {path:'dashboard'  , component: DashboardComponent, data: {titulo: 'Dashboard'}},
            {path:'progress'  , component: ProgressComponent, data: {titulo: 'Barra de progreso'}},
            {path:'grafica'  , component: Graficas1Component, data: {titulo: 'Graficas'}},
            {path: 'accout-settings', component: AccountSettingsComponent, data: {titulo: 'Ajustes Tema'}},
            {path:'promesas'  , component: PromesasComponent, data: {titulo: 'Promesas'}},
            {path:'rxjs'  , component: RxjsComponent, data: {titulo: 'RXJS'}},
            {path: '', redirectTo:'/dashboard',pathMatch:'full'}
        ]
    },
    
] 
export const Pages_Routes = RouterModule.forChild(pagesRoutes);