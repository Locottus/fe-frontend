import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent implements OnInit {

  // Form
  reactiveForm: FormGroup;

  // Demo data
  selectOptions = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
    { label: 'Option 3', value: 'opt3' }
  ];

  // Material demo
  materialButtonTypes = [
    { label: 'Basic', type: '' },
    { label: 'Raised', type: 'raised' },
    { label: 'Stroked', type: 'stroked' },
    { label: 'Flat', type: 'flat' }
  ];

  // Bootstrap demo
  bootstrapColors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];

  constructor(private fb: FormBuilder) {
    this.reactiveForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      country: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue],
      subscribe: [false]
    });
  }

  ngOnInit(): void {
  }

  // Form methods
  get firstName() {
    return this.reactiveForm.get('firstName');
  }

  get lastName() {
    return this.reactiveForm.get('lastName');
  }

  get email() {
    return this.reactiveForm.get('email');
  }

  get country() {
    return this.reactiveForm.get('country');
  }

  get acceptTerms() {
    return this.reactiveForm.get('acceptTerms');
  }

  onSubmit() {
    if (this.reactiveForm.valid) {
      console.log('Form Value:', this.reactiveForm.value);
      alert('Form submitted successfully! Check console for values.');
    }
  }

  resetForm() {
    this.reactiveForm.reset();
  }
}
