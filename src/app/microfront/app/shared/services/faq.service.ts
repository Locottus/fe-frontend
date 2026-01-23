import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { FaqDTO } from '../models/faq.dto';
import { catchError, tap } from 'rxjs/operators';
import { SettingsService } from 'src/app/core/services/settings.service';

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  faqUrl: string;

  constructor(private http: HttpClient, private settingsService: SettingsService) {
    this.faqUrl = `${this.settingsService.settings.baseUrl + this.settingsService.settings.backendRodadosUrl}PreguntasFrecuentes`;
  }

  getFaqs(): Observable<FaqDTO> {
    return this.http.get<FaqDTO>(this.faqUrl).pipe(
      tap(),
      catchError((error) => {
        return throwError(() => new Error('Error al obtener las preguntas frecuentes'));
      })
    );
  }
}
