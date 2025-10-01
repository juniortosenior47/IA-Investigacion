import { Component } from '@angular/core';
import { TranslateWord } from '../../../../core/application/TranslateWord';
import { FakeTranslatorAdapter } from '../../../../infrastructure/FakeTranslatorAdapter';
import { ApiTranslatorAdapter } from '../../../../infrastructure/ApiTranslatorAdapter';

@Component({
  selector: 'app-root',
  template: `
    <h1>Angular Traductor</h1>
    <input [(ngModel)]="word" placeholder="Escribe una palabra..." />
    <label>
      <input type="checkbox" [(ngModel)]="useApi" />
      Usar API real
    </label>
    <button (click)="translate()">Traducir</button>
    <p>{{ result }}</p>
  `
})
export class AppComponent {
  word = '';
  result = '';
  useApi = false;

  async translate() {
    const translator = this.useApi ? new ApiTranslatorAdapter() : new FakeTranslatorAdapter();
    const useCase = new TranslateWord(translator);
    this.result = await useCase.execute(this.word, 'es', 'en');
  }
}
