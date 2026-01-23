import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-kite-examples',
  templateUrl: './kite-examples.component.html',
  styleUrls: ['./kite-examples.component.scss']
})
export class KiteExamplesComponent implements OnInit {

  // Form states
  inputValue: string = '';
  emailValue: string = '';
  numberValue: number | null = null;
  selectValue: string = 'option1';
  checkboxValue: boolean = false;
  radioValue: string = 'radio1';
  textareaValue: string = '';
  searchValue: string = '';

  // Badge examples
  badges = [
    { variant: 'success', label: 'Exitoso' },
    { variant: 'error', label: 'Error' },
    { variant: 'warning', label: 'Advertencia' },
    { variant: 'default', label: 'Default' },
    { variant: 'info', label: 'Información' }
  ];

  // Color palette from microfront project
  colors = [
    { name: 'Rojo Supervielle', hex: '#ee2527' },
    { name: 'Rojo Claro', hex: '#d52b1e' },
    { name: 'Verde Congratulación', hex: '#5ebe4b' },
    { name: 'Blanco', hex: '#ffffff' },
    { name: 'Negro', hex: '#3a3a3a' },
    { name: 'Gris', hex: '#3e3d40' },
    { name: 'Gris Fondo', hex: '#f5f5f5' },
    { name: 'Gris Blanco', hex: '#ededed' },
    { name: 'Gris Metal', hex: '#999999' },
    { name: 'Gris Oscuro', hex: '#333333' },
    { name: 'Gris Rosado', hex: '#c7c7c7' },
    { name: 'Rosa Claro', hex: '#ffe6e6' },
    { name: 'Borde Card', hex: '#eaeaea' }
  ];

  // Font sizes
  fontSizes = [
    { size: 'lg', label: 'Large (18px)' },
    { size: 'md', label: 'Medium (16px)' },
    { size: 'sm', label: 'Small (14px)' },
    { size: 'xs', label: 'Extra Small (12px)' },
    { size: 'xxs', label: '2X Small (11px)' }
  ];

  // Font weights (Heebo family)
  fontWeights = [
    { weight: 300, label: 'Light (300)' },
    { weight: 400, label: 'Regular (400)' },
    { weight: 500, label: 'Medium (500)' },
    { weight: 700, label: 'Bold (700)' }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  // Event handlers
  onInputChange(value: string): void {
    console.log('Input changed:', value);
    this.inputValue = value;
  }

  onSelectChange(value: string): void {
    console.log('Select changed:', value);
    this.selectValue = value;
  }

  onCheckboxChange(checked: boolean): void {
    console.log('Checkbox changed:', checked);
    this.checkboxValue = checked;
  }

  onRadioChange(value: string): void {
    console.log('Radio changed:', value);
    this.radioValue = value;
  }

  onTextareaChange(value: string): void {
    console.log('Textarea changed:', value);
    this.textareaValue = value;
  }

  onButtonClick(buttonName: string): void {
    console.log('Button clicked:', buttonName);
    alert(`Botón "${buttonName}" presionado`);
  }

  onSearchChange(value: string): void {
    console.log('Search changed:', value);
    this.searchValue = value;
  }
}
