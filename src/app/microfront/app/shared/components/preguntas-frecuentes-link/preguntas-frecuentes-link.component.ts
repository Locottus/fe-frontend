import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-preguntas-frecuentes-link',
  templateUrl: './preguntas-frecuentes-link.component.html',
  styleUrls: ['./preguntas-frecuentes-link.component.scss']
})
export class PreguntasFrecuentesLinkComponent {
  @Output() select = new EventEmitter<void>();
  onToggle() { this.select.emit(); }
}
