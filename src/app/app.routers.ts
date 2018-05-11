import {URLSearchParams} from '@angular/http';
import { Routes , RouterModule} from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { NopagefoundComponent } from "./shared/nopagefound/nopagefound.component";
import { PagesComponent } from './pages/pages.component';
import { RegisterComponent } from './login/register.component';
import { AuthGuard } from './guards/auth.guard';

const appRouters: Routes = [
   
    {path:'login'  , component: LoginComponent},
    {path:'register'  , component: RegisterComponent},
    {path:'**', component: NopagefoundComponent}
];

export const APP_ROUTER = RouterModule.forRoot(appRouters);