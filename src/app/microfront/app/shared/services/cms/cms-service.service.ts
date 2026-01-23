import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {SettingsService} from '../../../core/services/settings.service';
import {Aviso, AvisoRespuestaAcoustic} from '../../../shared/models/aviso';
import { map, pluck } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CmsService {

  cmsUrl: string;

  constructor(private http: HttpClient, private settingsService: SettingsService) {
    this.cmsUrl = this.settingsService.settings.cmsUrl;
  }

  getAvisos(): Observable<AvisoRespuestaAcoustic[]> {
    return this.http.get<AvisoRespuestaAcoustic[]>(this.cmsUrl);
  }

  getAvisosMapeados(): Observable<Aviso[]> {
    return this.getAvisos().pipe(
      pluck('elements', 'toasts', 'values'),
      map( (response: AvisoRespuestaAcoustic[]) => this.mapeaCmsAAviso(response) ),
    );
  }

  private mapeaCmsAAviso(response: AvisoRespuestaAcoustic[] = []): Aviso[] {
    return response.map(
      ({elements}) => {
        const avisoAux: Aviso = {
          tipo: null,
          leyenda: '',
          leyenda_importante: '',
          link: {
            texto: '',
            href: ''
          }
        };
        avisoAux.tipo = elements.type.value.selection;
        avisoAux.leyenda = elements.legend.value;
        avisoAux.leyenda_importante = elements.legendImportant.value;
        avisoAux.link.texto = elements.link.linkText;
        avisoAux.link.href = elements.link.linkURL;
        return avisoAux;
      }
    );
  }
}
