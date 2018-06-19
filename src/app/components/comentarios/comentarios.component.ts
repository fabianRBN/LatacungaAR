import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ComentariosService } from '../../services/comentarios/comentarios.service';
import { Comentario } from '../../models/comentario.model';
import { ClienteService } from '../../services/cliente/cliente.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css']
})
export class ComentariosComponent implements OnInit {

  @Input() idAtractivo:string = 'idAtractivo';
  
  public comentarioList: Comentario[];
  private clienteSubscription: Subscription;

  constructor(
    private comentariosService:ComentariosService,
    private clienteService:ClienteService        
  ) { }

  ngOnInit() {
    this.comentarioList = [];
    this.comentariosService.obtenerComentariosDeAtractivosPorKey(this.idAtractivo).snapshotChanges()
    .subscribe(values => {
      values.forEach(value => {
        console.log(value.key);
        //console.log(value.payload.val());
        const comentario:any = value.payload.toJSON();
        const comentarioTemp = new Comentario();
        comentarioTemp.key = value.key;
        comentarioTemp.contenido = comentario.contenido;
        comentarioTemp.fecha = comentario.fecha;
        comentarioTemp.uidUsuario = comentario.uidUsuario;


        let clienteTemp = this.clienteService.obtenerClientePorKey(value.key).snapshotChanges();
    
        this.clienteSubscription = clienteTemp
        .map(item => {
          const key = item[0].payload.key;
          const datos = { key, ...item[0].payload.val() };

          return datos;
        })
        .subscribe(item=>{
          comentarioTemp.nombreUsuario = item.nombre;
          comentarioTemp.urlPhotoUsuario = item.pathImagen;
        });

  
        this.comentarioList.push(comentarioTemp);
        console.log(comentario.contenido);
//        this.comentarioList.push(value.payload.val() as Comentario);
      });
    });
    console.log(this.comentarioList);
  }

  datosCliente(key: string){
    let cliente = new Cliente()
    

    
    
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.clienteSubscription.unsubscribe();
  }
}

