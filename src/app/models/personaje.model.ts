import { Imagenes } from './imagenes.model';
export class Personaje {
  key: string;
  nombre: string;
  sexo: string;
  descripcion: string;
  galeria: Imagenes[];
  galeriaObject: Object;
  creadorUid: string;
  seleccionado: boolean;

  constructor() {}
}
