import { Georeferencia } from './georeferencia.model';
import { Imagenes } from './imagenes.model';
import { Horario } from './horario.model';
export class Atractivo {
    key: string;

    nombre: string;
    alias: string;
    categoria: string;
    tipo:string;
    subtipo:string;
    direccion: string;
    descripcion?: string;
    observacion?: string;
    posicion: Georeferencia;
    creadorUid: string;
    galeria: Imagenes[];
    galeriaObject: Object;
    horario?: Horario;

    rating:number;
    pathUrl360:string;
    numeroVisitas?:number;
    listaVisitantes?:string[];
    

constructor( ) {}

}
