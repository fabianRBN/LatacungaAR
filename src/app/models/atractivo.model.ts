import { Georeferencia } from './georeferencia.model';
import { Imagenes } from './imagenes.model';
export class Atractivo {
    key: string;

    nombre: string;
    alias: string;
    categoria: string;
    direccion: string;
    descripcion?: string;
    observacion?: string;
    posicion: Georeferencia;
    creadorUid: string;
    galeria: Imagenes[];
    galeriaObject: Object;

    rating:number;
    

constructor( ) {}

}
