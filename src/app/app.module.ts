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

// Servicio de angular maps
import { AgmCoreModule } from '@agm/core';



// ng Boostrap 

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

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
    NgbModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB56X_uZShFyQnx5Md4tzTO8ianh7zOz-M'
    })
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
