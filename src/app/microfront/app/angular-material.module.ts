import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { A11yModule } from '@angular/cdk/a11y';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatRippleModule } from '@angular/material/core';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

const matDialogConfig = new MatDialogConfig();
matDialogConfig.maxWidth = '90vw';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatProgressBarModule,
  MatDialogModule,
  MatSidenavModule,
  MatExpansionModule,
  CdkStepperModule,
  A11yModule,
  MatRadioModule,
  MatRippleModule,
  ClipboardModule,
  MatFormFieldModule,
  MatInputModule,
  MatAutocompleteModule,
  MatTabsModule,
  MatSelectModule,
  MatCheckboxModule,
  MatSliderModule,
  MatGridListModule,
  MatSlideToggleModule,
  MatCheckboxModule,
  MatDialogModule,
  MatTableModule,
  MatPaginatorModule,
  MatDatepickerModule,
  MatNativeDateModule
];

@NgModule({
  declarations: [],
  imports: materialModules,
  exports: materialModules,
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: matDialogConfig
    }
  ]
})
export class AngularMaterialModule { }
