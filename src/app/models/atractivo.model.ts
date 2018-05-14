import { Georeferencia } from './georeferencia.model';
import { Imagenes } from './imagenes.model';
export class Atractivo{
    
    id:string;
    nombre: string;
    categoria: string;
    descripcion?: string;
    observacion?: string;
    posicion: Georeferencia;
    creadorUid: string;
    galeria: Imagenes[];


constructor( ){
        }

}