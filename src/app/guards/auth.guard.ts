import { Injectable } from '@angular/core';
import { CanActivate,CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import {AngularFireAuth} from 'angularfire2/auth';
import { AuthService } from '../services/auth/auth.service';


import  'rxjs/add/operator/do';
import  'rxjs/add/operator/map';
import  'rxjs/add/operator/take';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private router: Router,
    private afauth: AngularFireAuth,
    private authService: AuthService
  ){

  }


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.afAuth.authState
      .take(1)
      .map(authState =>!! authState)
      .do( autentificado =>{
        console.log("autenficado:");
        console.log(autentificado);
        if(!autentificado){
          this.router.navigate(['/login']);
        }
      });
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean  {
    return this.authService.afAuth.authState
      .take(1)
      .map(authState => !! authState)
      .do( autentificado =>{
        console.log("autenficado:");
        console.log(autentificado);
        if(!autentificado){
          this.router.navigate(['/login']);
        }
      });
  }
}
