import { Component, Input, forwardRef, inject } from '@angular/core';
import {
  ControlValueAccessor,
  FormGroupDirective,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { PopoverDirective } from '../popover.directive';

@Component({
  selector: 'app-form-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    PopoverDirective,
  ],
  template: `
    <div class="mt-4">
      <div class="w-100 mb-2 fs-6 fw-bolder">{{ placeholder }}</div>
      <div [ngClass]="wrapperClass()" class="w-100">
        <input
          autocomplete="off"
          #input
          id="input"
          title=""
          (keydown)="$event.preventDefault()"
          (focus)="showDropdownOptions = true"
          (blur)="showDropdownOptions = false"
          [placeholder]="'Choose an option'"
          [ngModel]="value.name"
          class="form-input"
          [isPopover]="showDropdownOptions"
          [appendTo]="'body'"
          [position]="'bottom-inline-left'"
          [template]="dropdownTemplate"
        />
        <ng-template #dropdownTemplate>
          <ul class="dropdown">
            <li
              *ngFor="let option of data"
              class="dropdown-option"
              (click)="onInputChange(option)"
            >
              {{ option.name }}
            </li>
          </ul>
        </ng-template>
      </div>
      <!-- <app-form-error
        [controlGroup]="hostFormGroup!.control!.controls"
        [controlName]="formControlName"></app-form-error> -->
    </div>
  `,
  styles: [
    `
      * {
        box-sizing: border-box;
      }
      .form-input {
        padding: 0.5rem 0.75rem;
        border-radius: calc(0.5rem - 2px);
        height: 2rem;
        font-size: 0.875rem;
        line-height: 1.25rem;
        border: 1px solid var(--border-color);
        background-color: var(--primary-light);
        color: var(--text-dark);
        position: relative;
        z-index: 51;
        transition: 0.15s border;
        &:focus-visible {
          box-shadow: var(--primary-light);
          outline: 2px solid var(--text-accent);
          outline-offset: 1px;
        }
      }
      .dropdown-wrapper {
        position: relative;
        display: flex;
        justify-content: center;
        flex-direction: column !important;
      }
      .dropdown-wrapper:focus-within {
        .form-input::placeholder {
          opacity: 0;
        }
      }
      .dropdown {
        list-style: none;
        border-radius: calc(0.5rem - 2px);
        border: 1px solid var(--border-color);
        width: 100%;
        margin: 0;
        padding: 0;
        max-height: 200px;
        overflow-y: auto;
        li {
          padding: 0.5rem 0.75rem;
          background-color: var(--primary-medium);
          list-style: none;
          transition: 0.15s all;
        }
        li:hover {
          cursor: pointer;
          background-color: var(--primary-light);
          color: var(--text-accent);
        }
      }
      .input-destructive {
        .form-input {
          transition: 0.15s;
          box-shadow: var(--primary-light);
          outline: 2px solid var(--destructive);
        }
      }
      .input-success {
        .form-input {
          transition: 0.15s;
          box-shadow: var(--primary-light);
        }
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormDropdownComponent),
      multi: true,
    },
  ],
})
export class FormDropdownComponent implements ControlValueAccessor {
  @Input({ alias: 'formControlName', required: true }) formControlName: any;
  @Input({ alias: 'data', required: true }) data: any;
  @Input({ alias: 'placeholder', required: true }) placeholder: string = '';
  @Input({ alias: 'disabled', required: false }) disabled: boolean = false;

  value: any;
  showDropdownOptions: boolean = false;

  readonly hostFormGroup: FormGroupDirective = inject(FormGroupDirective);

  wrapperClass(): Object {
    return {
      'dropdown-wrapper': true,
      'input-destructive':
        this.hostFormGroup?.control?.controls[this.formControlName]?.invalid &&
        this.hostFormGroup?.control?.controls[this.formControlName]?.touched,
      'input-success':
        this.hostFormGroup?.control?.controls[this.formControlName]?.valid,
    };
  }

  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInputChange(value: any): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }
}
