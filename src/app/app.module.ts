import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//====================================================
//         Modulos Firebase
//====================================================

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

//====================================================
//         Configuraciones de entorno
//====================================================
import { environment } from '../environments/environment';


//====================================================
//         Indice de Router
//====================================================
import { APP_ROUTER } from './app.routers';

//====================================================
//         Componentes principales
//====================================================
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';
import {PagesModule} from './pages/pages.module';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Servicios
import { ServiceModule } from './services/service.module';

// Servico guard para login
import { AuthGuard } from './guards/auth.guard';

import { HttpModule } from '@angular/http';





@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    APP_ROUTER,
    PagesModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
  AngularFireAuthModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
