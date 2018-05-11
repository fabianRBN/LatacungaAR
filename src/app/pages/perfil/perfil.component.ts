import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { NgModule } from '@angular/core';
import { auth } from 'firebase/app';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ArchivoService } from '../../services/archivo/archivo.service';
import  'sweetalert';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  // Informacion recuperada
  public nombreU: string;
  public email: string;
  public photoUrl: string;
  public proveedor : string;

  public usuario = new Usuario();
  //Informacion nueva
  public nuevoEmail: string ;
  public nuevoNombre: string;
  public nuevaPhotoUrl: string;
  public password1: string;
  public password2: string;  
  
  // Variables temporales
  public password_igual: boolean = false;
  public labelImagen: string;
  public imagenaSubir: boolean = false;
  public imagenTemp: string;
  public archivo: File;
  public modo_edicion: boolean = false;
  // forma : FormGroup;
  
  constructor(
    public authService:AuthService,
    public usuarioService: UsuarioService,
    public archivoService : ArchivoService
  ) {
    // this.forma = new FormGroup({
    //   nombre : new FormControl(this.usuario.nombre, Validators.required),
    //   email: new FormControl(this.usuario.email, [Validators.email, Validators.required]),
    //   password: new FormControl(null,null),
    //   password2: new FormControl(null ,null),
    //  // photoURL: new FormControl(null , Validators.required)
    // },{validators: this.sonIguales('password','password2')});


   }

  ngOnInit() {

    //====================================================
    //         Recuperar informacion del usuario
    //====================================================
    
    this.authService.getAuth().subscribe(
      auth => {
        if(auth){

          // this.usuarioService.obtenerUsuarioPorKey(auth.uid).snapshotChanges()
          // .subscribe(item =>{
          //   const y = item[0].payload.toJSON();
          //           y['key'] = item[0].key;
          //   this.usuario = y as Usuario;
          //   this.usuario.id = auth.uid;
          //   this.usuario.proveedor = auth.providerData[0].providerId.split('.')[0];     
          //   this.email = this.usuario.email;
          //   this.nombre = this.usuario.nombre;
          //   this.photoUrl = this.usuario.photoURL;
          //   this.proveedor = this.usuario.proveedor;
          // });

            this.usuario.id = auth.uid;
            this.email = auth.email;
            this.nombreU = auth.displayName || 'usuario';
            this.nuevoNombre =  this.nombreU;
            this.photoUrl = auth.photoURL;
            this.proveedor = auth.providerData[0].providerId.split('.')[0];
            this.labelImagen = 'Elija el archivo';
     
        }
      }
    )


  }

//====================================================
//         Modificar informacion del usuario
//====================================================

editarUsuario(){
  this.modo_edicion = true;

}
cancelarActualizarUsuario(){
  this.modo_edicion = false;
}
//====================================================
//         Actualizar datos del usuario
//====================================================
actualizarUsuari(){

// Validar que el usuario es el que modifica sus datos por medio de la contraseña
  swal("Confirmar cambios, ingrese password", {content: {element: "input",attributes: {
        type: "password",
        
  }}})
  .then((value) => {
    this.authService.reAuthenticate(this.usuario.email,value).then(resolve=>{
      // Validar email 
      if(this.email.toUpperCase() != this.nuevoEmail.toUpperCase()){
        this.authService.updateEmail(this.nuevoEmail).then(resolve=>{
          // validacion exitosa
        }).catch(error=>{
          // si algo sale mal en la validacion
        });
      }

      // validar password
      if(value != this.password1 && this.password1 !=''  ){
        this.authService.updatePass(this.password1).then(resol=>{
        }).catch(error=>{ 
          // Indicar los errores del password
          swal("Imortante", "La  contraseña nueva debe poseer minimo 6 caracteres" , "warning",);
         });
      }
      this.usuario.nombre = this.nuevoNombre;
      this.authService.updateUserProfile(this.usuario);

      swal("", "Usuario: "+ this.nuevoNombre +" Actualizado" , "success").then(resol=>{
        window.location.reload();
      })
      
    }).catch(error=>{
      swal("Imortante", "Contraseña incorrecta ", "warning",);
    });
      
    
  });

}


// Funcion para verificar que las contraseñas nuevas son iguales
onSearchChange(searchValue : string ) { 
   
  if(this.password1 === this.password2){
    this.password_igual= false;
  }else{
    this.password_igual= true;
  }

}


//====================================================
//         Funcion para actualizar Imagen 
//====================================================
actualizarImagen() {
  if (this.archivo != null) {
    const ubicacion = 'imagenes/usuarios/' + this.usuario.id;
    // Borrar la imagen anterior
    this.archivoService.borrarArchivo(ubicacion).catch(err => {
      if (err.code !== 'storage/object-not-found') {
        console.log(err);
        
      }
    });
    // Subir imagen nueva
    this.archivoService
      .subirArchivo(this.archivo, ubicacion)
      .then(res => {
        this.usuario.photoURL = res.downloadURL;

        this.authService.updateUserProfile(this.usuario);

        // Recargar la pagina para mostrar cambios de imagen 
        window.location.reload();
      })
      .catch(err => {
        console.log(err);
        
      });
  } 
}
// Valir que el archivo que se sube sea una imagen 
selecionarArchivo(archivos: FileList) {
  this.archivo = archivos.item(0);
  if(this.archivo.type.indexOf('image')< 0){
    swal('Solo Imagenes', 'El archivo seleccionado no es una Imagen', 'error')
    this.imagenaSubir= false;
    return;
  }
  this.imagenaSubir = true;
  this.labelImagen = this.archivo.name;

  // Vista previa de imagen 
  let reader = new FileReader();
  let urlImagenTemp = reader.readAsDataURL(this.archivo);
  reader.onloadend=()=> this.imagenTemp = reader.result;

}

}
