import { Georeferencia } from './georeferencia.model';
import { Horario } from './horario.model';
export class Servicio {
  key: string;
  nombre: string;
  categoria: string;
  tipoDeActividad: string;
  direccion: string;
  posicion: Georeferencia;
  contacto?: string;
  correo?: string;
  web?: string;
  facebookPage?: string;
  horario?: Horario;
  alias: string;
  creadorUid: string;
  constructor() {}
}
