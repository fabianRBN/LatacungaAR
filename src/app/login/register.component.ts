import { Component, OnInit, group } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
// Servicio de Autenticacion
import { AuthService } from '../services/auth/auth.service';
// Libreria para mensajes emergentes
import  'sweetalert';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { UsuarioService } from '../services/service.index';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalRef
} from "@ng-bootstrap/ng-bootstrap";


//Declaracion de funcion para iniciar plugins del tema
declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css']
})
export class RegisterComponent implements OnInit {

  public usuario = new Usuario();
  forma : FormGroup;
  modalRef: NgbModalRef;
  constructor(
    public authService : AuthService,
    public router: Router,
    public usuarioService: UsuarioService,
    private modalService: NgbModal

  ) { 
    init_plugins();
    this.forma = new FormGroup({
      nombre : new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, Validators.required),
      password2: new FormControl(null , Validators.required),
      condiciones: new FormControl(null , Validators.required)
    },{validators: this.sonIguales('password','password2')});

  }

  sonIguales(campo1: string, campo2: string)
  {
    return (group: FormGroup)=>{
      let  pass1 = group.controls[campo1].value;
      let pass2= group.controls[campo2].value;
      if(pass1 === pass2){
        return null;
      }
      return {
        sonIguales: true
      };
    }

  }
  ngOnInit() {
    
  }

  registrarUsuario(){
    

    if(!this.forma.value.condiciones){
      swal("Imortante", "Aceptar condiciones", "warning");
      return;
            
    }
    if(this.forma.invalid){
      swal("Imortante", "Datos incorrectos", "warning");
      return;
    }

    this.authService.registerUser(this.forma.value.email,this.forma.value.password).then(
      (res:any)=>{
        swal("", "Usuario: "+ this.forma.value.email+ " registrado" , "success")
        .then(value=>{
          

          this.usuario.nombre = this.forma.value.nombre;
          this.usuario.email = this.forma.value.email;
          this.usuario.photoURL = "https://www.tenforums.com/geek/gars/images/2/types/thumb__ser.png";
          this.usuario.role = "ADMIN";
          this.usuario.key = res.uid;
          this.guardarUsuario(this.usuario);
          this.router.navigate(['/login']);
        });
        
      }
    ).catch( (error:any)=>{
      if(error){
        swal("", error.message , "warning");
        
      }
    });
    
  }

  guardarUsuario(usuario: Usuario){
      this.usuarioService.crearUsuario(usuario);
  
  }

  mostraModal(modelId) {

    this.modalRef = this.modalService.open(modelId, { centered: true , size: 'lg'});
  }

}
