import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
})
export class LoadingSpinnerComponent {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() message: string = 'Loading...';
  @Input() color: string = 'primary';

  get spinnerClass(): string {
    const sizeClass = this.size === 'small' ? 'spinner-border-sm' : '';
    return `spinner-border text-${this.color} ${sizeClass}`;
  }
}