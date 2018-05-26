import { Georeferencia } from './georeferencia.model';
export class Servicio {
  key: string;
  nombre: string;
  categoria: string;
  tipoDeActividad: string;
  direccion: string;
  posicion: Georeferencia;
  contacto?: string;
  web?: string;
  alias: string;
  creadorUid: string;

  constructor() {}
}
