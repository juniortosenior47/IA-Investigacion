import { Component } from '@angular/core';
import { Container } from '../../../../config/container';

@Component({
  selector: 'app-root',
  template: `
    <div style="padding:20px">
      <h1>Traductor Hexagonal (Angular)</h1>
      <textarea [(ngModel)]="text" rows="4" cols="50" placeholder="Escribe texto en español..."></textarea>
      <div style="margin-top:10px">
        <button (click)="translate()">Traducir</button>
      </div>
      <p style="white-space: pre-wrap">{{ result }}</p>
    </div>
  `
})
export class AppComponent {
  text = '';
  result = '';

  async translate() {
    const svc = Container.getTranslateService();
    const words = this.text.trim().split(/\s+/);
    const res = await svc.translateArray(words, 'spanish', 'english');
    this.result = res.join(' ');
  }
}
