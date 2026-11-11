import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
})
export class EmptyStateComponent {
  @Input() title: string = 'No items found';
  @Input() description: string = 'Looks like there\'s no data to show here.';
  @Input() showAction: boolean = false;
  @Input() actionLabel: string = 'Add';
  @Input() actionIcon: string = 'pi pi-plus';
  @Output() actionClick = new EventEmitter<void>();
}
