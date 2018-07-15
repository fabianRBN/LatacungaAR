import { Georeferencia } from './georeferencia.model';
import { Horario } from './horario.model';
export class Servicio {
  key: string;
  nombre: string;
  alias: string;
  tipoDeActividad: string;
  subTipoDeActividad: string;
  categoria: string;
  direccion: string;
  contacto?: string;
  correo?: string;
  web?: string;
  facebookPage?: string;
  posicion: Georeferencia;
  horario?: Horario;
  creadorUid: string;
  constructor() {}
}
