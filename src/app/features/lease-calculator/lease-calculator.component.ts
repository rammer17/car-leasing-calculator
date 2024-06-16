import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormDropdownComponent } from '../../shared/form-components/dropdown/dropdown.component';
import { InputComponent } from '../../shared/form-components/input/input.component';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
} from 'rxjs';
import { AsyncPipe, CurrencyPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-lease-calculator',
  standalone: true,
  imports: [
    FormDropdownComponent,
    FormsModule,
    ReactiveFormsModule,
    InputComponent,
    NgIf,
    AsyncPipe,
    CurrencyPipe,
  ],
  templateUrl: './lease-calculator.component.html',
  styleUrl: './lease-calculator.component.scss',
})
export class LeaseCalculatorComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);

  leasePeriodsArr: { name: string; value: number }[] = [
    { name: '12 months', value: 12 },
    { name: '24 months', value: 24 },
    { name: '36 months', value: 36 },
    { name: '48 months', value: 48 },
    { name: '60 months', value: 60 },
  ];
  carTypeArr: { name: string; value: number }[] = [
    { name: 'Brand New', value: 2.99 },
    { name: 'Used', value: 3.7 },
  ];

  leaseForm?: FormGroup;

  vm$?: Observable<any>;

  ngOnInit(): void {
    this.initForm();
  }

  onInputChange(e: any, control: string): void {
    let newValue = e.target.value;
    //Validate new value
    if (control === 'value' && (newValue < 10000 || newValue > 200000)) {
      if (newValue < 10000) newValue = 10000;
      else newValue = 200000;
    }
    if (control === 'downPayment' && (newValue < 10 || newValue > 50)) {
      if (newValue < 10) newValue = 10;
      else newValue = 50;
    }
    this.leaseForm?.get(control)?.setValue(newValue);
  }

  private initForm(): void {
    this.leaseForm = this.fb.group({
      type: this.fb.control<any>(this.carTypeArr[0], [Validators.required]),
      period: this.fb.control<number>(0, [Validators.required]),
      value: this.fb.control<number>(120000, [
        Validators.required,
        Validators.min(10000),
        Validators.max(200000),
      ]),
      downPayment: this.fb.control<number>(10, [
        Validators.required,
        Validators.min(10),
        Validators.max(50),
      ]),
    });

    this.vm$ = this.leaseForm.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(100),
      map((x: any) => {
        const interestRate = x.type.value;
        const downPayment = x.value * (x.downPayment / 100);
        const monthlyPayement =
          (x.value - downPayment) *
            this.convertInterestRateToMoneyFactor(interestRate) +
          (x.value - downPayment) / x.period.value;
        return {
          interestRate: interestRate || 0,
          downPayment: downPayment || 0,
          monthlyPayment: monthlyPayement || 0,
          totalLeasingCost: x.period.value * monthlyPayement + downPayment || 0,
        };
      }),
      startWith({
        interestRate: this.leaseForm.get('type')?.value.value,
        downPayment:
          (this.leaseForm.get('downPayment')?.value / 100) *
          this.leaseForm.get('value')?.value,
        monthlyPayment: 0,
        totalLeasingCost: 0,
      })
    );
  }

  private convertInterestRateToMoneyFactor(interestRate: number): number {
    return interestRate / 2400;
  }
}
