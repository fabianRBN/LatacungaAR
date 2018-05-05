import { Component, OnInit, group } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import  'sweetalert';
declare function init_plugins();
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css']
})
export class RegisterComponent implements OnInit {

  forma : FormGroup;
  constructor() { 
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
      return;
    }
    console.log(this.forma.value);
    console.log('Form validad', this.forma.valid)

  }

}
