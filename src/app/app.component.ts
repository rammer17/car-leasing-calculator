import { Component } from '@angular/core';
import { LeaseCalculatorComponent } from './features/lease-calculator/lease-calculator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LeaseCalculatorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'car-leasing-calculator';
}
