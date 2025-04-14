import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styles: ``,
})
export class CardsComponent {
  @Input() cards: { title: string; count: number | string; icon: string }[] =
    [];
}
