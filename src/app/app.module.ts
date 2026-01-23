import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// Material modules
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

// Kite modules - import individual modules as needed
import { ButtonModule as KiteButtonModule } from '@kite/angular';
import { InputModule as KiteInputModule } from '@kite/angular';

// ng-bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// App modules
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PlaygroundComponent } from './playground/playground.component';
import { DesignShowcaseComponent } from './design-showcase/design-showcase.component';

@NgModule({
  declarations: [
    AppComponent,
    PlaygroundComponent,
    DesignShowcaseComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    // Material modules
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatToolbarModule,
    MatIconModule,
    // Kite modules
    KiteButtonModule,
    KiteInputModule,
    // ng-bootstrap
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
