import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import  'sweetalert';
import { UsuarioService } from '../services/usuario/usuario.service';
import { Usuario } from '../models/usuario.model';

declare function init_plugins();
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public usuario = new Usuario();
  forma : FormGroup;
  constructor(
    public router: Router,
    public authService: AuthService,
    public usuarioService: UsuarioService
  ) { 

    this.forma = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password : new FormControl(null, Validators.required)
    })

  }

  ngOnInit() {
    init_plugins();

  }

  ingresar(){

      this.authService.loginEmail(this.forma.value.email,this.forma.value.password)
        .then( res=>{
          this.router.navigate(['/dashboard']);
        })
        .catch(error=>{
          swal("", error.message , "warning");
        });
      
      
  }

  verificarCorreo(){
    this.authService.sendVerificationEmail();
  }

  loginGoogle(){
    this.authService.loginGoogle()
    .then( resolve =>{
 
      this.setUsuario(resolve);
      
      this.usuarioService.registroUsuario(this.usuario);


      this.router.navigate(['/dashboard']);
     
    }).catch( reject=>{
      swal("", reject.message , "warning");
    });
  }

  loginFacebook(){
    this.authService.loginFacebook()
    .then( resolve =>{


      this.setUsuario(resolve);
      this.usuario.photoURL = this.usuario.photoURL +'?type=large';
      this.usuarioService.registroUsuario(this.usuario);


      console.log(resolve);
      this.router.navigate(['/dashboard']);
    }).catch( reject=>{
      swal("", reject.message , "warning");
    });
  }

  setUsuario(resolve: any){
    this.usuario.nombre = resolve.user.displayName;
    this.usuario.email = resolve.user.email;
    this.usuario.photoURL = resolve.user.photoURL;
    this.usuario.id=resolve.user.uid
    this.usuario.role = 'ADMIN';
    
  }


}
