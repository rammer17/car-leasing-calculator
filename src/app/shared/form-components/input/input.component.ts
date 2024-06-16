import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div [ngClass]="wrapperClass()">
      <input
        #input
        id="input"
        [disabled]="disabled"
        [type]="type"
        [placeholder]="placeholder"
        [max]="max"
        [min]="min"
        title=""
        [checked]="checked"
        [ngModel]="value"
        (ngModelChange)="onInputChange($event)"
        [accept]="allowedExtensions"
        [ngClass]="inputClass()"
      />
      <i
        *ngIf="inputIcon && type !== 'checkbox'"
        [style]="{ color: iconColor }"
        [ngClass]="iconClass()"
        class="fa fa-{{ inputIcon }} fa-{{ iconSize }}"
      ></i>
    </div>
  `,
  styles: [
    `
      * {
        box-sizing: border-box;
      }
      .is-input {
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
        width: 100%
      }
      .is-input:disabled:hover {
        cursor: not-allowed;
      }
      input:not([type='checkbox']):focus-visible {
        box-shadow: var(--primary-light);
        outline: 2px solid var(--text-accent);
        outline-offset: 1px;
      }
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      input[type='number'] {
        -moz-appearance: textfield;
        appearance: textfield;
      }
      .input-wrapper {
        position: relative;
        display: flex;
        justify-content: center;
        flex-direction: column !important;
      }
      .input-wrapper:focus-within {
        .is-input::placeholder {
          opacity: 0;
        }
      }
      .input-destructive {
        .is-input {
          transition: 0.15s;
          box-shadow: var(--primary-light);
          outline: 2px solid var(--destructive);
        }
      }
      .input-success {
        .is-input {
          transition: 0.15s;
          box-shadow: var(--primary-light);
          outline: 2px solid var(--success);
        }
      }
      .input-ghost {
        .is-input {
          outline: none;
          border: none;
        }
      }

      .is-input::file-selector-button {
        background: var(--primary-light);
        color: var(--text-dark);
        outline: none;
        border: none;
      }
      .input-file-icon {
        .is-input::file-selector-button {
          margin-left: 20px;
        }
      }
      .input-icon {
        input {
          padding-left: 2rem;
        }
      }
      .is-input::file-selector-button:hover,
      input[type='file']:hover {
        cursor: pointer;
      }
      fa-icon {
        color: var(--text-dark);
        position: absolute;
        z-index: 51;
        transform: translateX(50%);
      }
      .is-input-icon-right {
        right: 0;
        transform: translateX(-50%);
      }
      .is-input[type='checkbox'] {
        -moz-appearance: none;
        appearance: none;
        padding: 0.1rem 0.4rem;
        width: 16px;
        height: 16px;
        transition-duration: 0.15s;
        transition-property: background-color;
        border-color: var(--primary);
        background-color: var(--primary-light);
      }
      .is-input[type='checkbox']::before {
        content: '✓';
        color: transparent;
        position: relative;
        top: -4px;
        left: -4px;
      }
      .is-input[type='checkbox']:checked {
        -moz-appearance: none;
        background-color: var(--primary);
      }
      .is-input[type='checkbox']:checked::before {
        content: '✓';
        color: black;
      }
      .is-input[type='checkbox']:focus-visible {
        outline: none;
      }
      .input-checkbox {
        display: inline-flex;
        align-items: center;
      }
    `,
  ],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.None
})
export class InputComponent implements ControlValueAccessor {
  @Input() value: any;
  @Input('type') type: InputTypes = 'text';
  @Input('placeholder') placeholder: string = '';
  @Input('invalid') invalid: boolean = false;
  @Input('valid') valid: boolean = false;
  @Input('disabled') disabled: boolean = false;
  @Input('allowedExtensions') allowedExtensions: string[] = [];
  @Input('icon') inputIcon?: any;
  @Input('iconPos') iconPos: 'left' | 'right' = 'left';
  @Input('iconColor') iconColor?: string;
  @Input('iconSize') iconSize?: '2xs' | 'xs' | 'sm' | 'lg' | 'xl' | '2xl';
  @Input('ghost') ghost: boolean = false;
  @Input('checked') checked: boolean = false;
  @Input('min') min?: number;
  @Input('max') max?: number;
  @Output('onChange') onValueChange: EventEmitter<any> =
    new EventEmitter<any>();

  @ViewChild('input') input?: ElementRef<HTMLInputElement>;

  onChange: any = () => {};
  onTouched: any = () => {};

  inputClass(): Object {
    return {
      'is-input': true,
      'p-0': this.type === 'range',
    };
  }

  wrapperClass(): Object {
    return {
      'input-wrapper': true,
      'input-destructive': this.invalid,
      'input-success': this.valid,
      'input-file-icon':
        this.type === 'file' && this.iconPos === 'left' && this.inputIcon,
      'input-icon': this.inputIcon && this.iconPos === 'left',
      'input-ghost': this.ghost,
      'input-checkbox': this.type === 'checkbox',
    };
  }

  iconClass(): Object {
    return {
      'is-input-icon-right': this.iconPos === 'right',
    };
  }

  writeValue(value: string): void {
    this.value = value;
    if (this.type === 'checkbox') {
      this.onInputChange(true);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onInputChange(value: any): void {
    if (this.type === 'checkbox') {
      this.checked = !this.checked;
      value = this.checked;
    }
    this.value = value;
    this.onChange(value);
    this.onTouched();
    this.onValueChange.emit(value);
  }
}

export type InputTypes =
  | 'text'
  | 'number'
  | 'password'
  | 'file'
  | 'checkbox'
  | 'email'
  | 'range';
