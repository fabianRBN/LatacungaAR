import { URLSearchParams } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { GraficasComponent } from './graficas/graficas.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { AuthGuard } from '../guards/auth.guard';
import { PerfilComponent } from './perfil/perfil.component';
import { AtractivoComponent } from './atractivo/atractivo/atractivo.component';
import { CrearAtractivoComponent } from './atractivo/crear-atractivo/crear-atractivo.component';
import { DetalleAtractivoComponent } from './atractivo/detalle-atractivo/detalle-atractivo.component';
import { ServicioComponent } from './servicio/servicio/servicio.component';
import { CrearServicioComponent } from './servicio/crear-servicio/crear-servicio.component';
import { DetalleServicioComponent } from './servicio/detalle-servicio/detalle-servicio.component';
import { PersonajeComponent } from './personaje/personaje/personaje.component';
import { CrearPersonajeComponent } from './personaje/crear-personaje/crear-personaje.component';
import { DetallePersonajeComponent } from './personaje/detalle-personaje/detalle-personaje.component';
import { NopagefoundComponent } from '../shared/nopagefound/nopagefound.component';

const pagesRoutes: Routes = [
    {
        path: '',
        component: PagesComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent, data: { titulo: 'Dashboard' } },
            { path: 'progress', component: ProgressComponent, data: { titulo: 'Barra de progreso' } },
            { path: 'grafica', component: GraficasComponent, data: { titulo: 'Graficas' } },
            { path: 'accout-settings', component: AccountSettingsComponent, data: { titulo: 'Ajustes Tema' } },
            { path: 'promesas', component: PromesasComponent, data: { titulo: 'Promesas' } },
            { path: 'rxjs', component: RxjsComponent, data: { titulo: 'RXJS' } },
            { path: 'perfil', component: PerfilComponent, data: { titulo: 'Perfil' } },
            { path: 'atractivo', component: AtractivoComponent, data: { titulo: 'Atractivos' } },
            { path: 'crear-atractivo', component: CrearAtractivoComponent, data: { titulo: 'Crear Atractivo' } },
            { path: 'crear-atractivo/:id', component: CrearAtractivoComponent, data: { titulo: 'Editar Atractivo' } },
            { path: 'detalle-atractivo/:id', component: DetalleAtractivoComponent, data: { titulo: 'Detalle Atractivo' } },
            { path: 'servicio', component: ServicioComponent, data: { titulo: 'Servicios' } },
            { path: 'crear-servicio', component: CrearServicioComponent, data: { titulo: 'Crear Servicio' } },
            { path: 'crear-servicio/:id', component: CrearServicioComponent, data: { titulo: 'Editar Servicio' } },
            { path: 'detalle-servicio/:id', component: DetalleServicioComponent, data: { titulo: 'Detalle Servicio' } },
            { path: 'personaje', component: PersonajeComponent, data: { titulo: 'Personaje' } },
            { path: 'crear-personaje', component: CrearPersonajeComponent, data: { titulo: 'Crear Personaje' } },
            { path: 'crear-personaje/:id', component: CrearPersonajeComponent, data: { titulo: 'Editar Personaje' } },
            { path: 'detalle-personaje/:id', component: DetallePersonajeComponent, data: { titulo: 'Detalle Personaje' } },
            { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
        ],
    },
];
export const Pages_Routes = RouterModule.forChild(pagesRoutes);
