import { Injectable } from '@angular/core';
import { AngularFireAuth} from 'angularfire2/auth'
import * as firebase from 'firebase/app';
import { Usuario } from '../../models/usuario.model';
@Injectable()
export class AuthService {

  constructor(
    public afAuth: AngularFireAuth
  ) { }

//====================================================
//         Login por correo y contraseña
//====================================================
  registerUser(email: string, pass:string){
    return new Promise((resolve, reject)=>{
      this.afAuth.auth.createUserWithEmailAndPassword(email,pass)
        .then(userData => resolve(userData), error => reject(error));
    });
  }

  loginEmail(email: string, pass:string){
    return new Promise((resolve, reject)=>{
      this.afAuth.auth.signInWithEmailAndPassword(email,pass)
        .then(userData => resolve(userData), error => reject(error));
    });
  }
 
  updateEmail(correo: string) {
    return this.afAuth.auth.currentUser.updateEmail(correo);
  }

 
  updatePass(nuevaContrasenia: string) {
    return this.afAuth.auth.currentUser.updatePassword(nuevaContrasenia);
  }

  reAuthenticate(correo: string, contrasenia: string) {
    const cred = firebase.auth.EmailAuthProvider.credential(
      this.afAuth.auth.currentUser.email,
      contrasenia
    );
    return this.afAuth.auth.currentUser.reauthenticateWithCredential(cred);
  }

  sendVerificationEmail() {
    return this.afAuth.auth.currentUser.sendEmailVerification();
  }

  // Actualizar perfil de usuario
  updateUserProfile(usuario: Usuario) {
    return this.afAuth.auth.currentUser.updateProfile({
      
      displayName: usuario.nombre,
      photoURL: usuario.photoURL,
      
    });
  }
  
//====================================================
//         Login por google
//====================================================

  loginGoogle(){
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

//====================================================
//         Login co Facebook  
//====================================================

  loginFacebook(){
    return this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
  }

  getAuth(){
    return this.afAuth.authState.map(auth => auth);
  }

  logout(){
    return this.afAuth.auth.signOut();
  }





}
