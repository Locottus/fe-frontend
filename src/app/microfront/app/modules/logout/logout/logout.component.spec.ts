import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';

import { LogoutComponent } from './logout.component';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { SessionExpiradaDialogComponent } from '../../../shared/components/session-expirada-dialog/session-expirada-dialog.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';

describe('LogoutComponent', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;
  let dialog: MatDialog;
  let overlayContainer: OverlayContainer;

  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  const mockMatDialog = {
    open: jasmine.createSpy('open'),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LogoutComponent, SessionExpiradaDialogComponent],
      imports: [AngularMaterialModule],
      providers: [ { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MatDialog, useValue: mockMatDialog }]
    })
      .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [SessionExpiradaDialogComponent] } })
    .compileComponents();
  }));

  beforeEach(inject([MatDialog, OverlayContainer],
    (d: MatDialog, oc: OverlayContainer) => {
      dialog = d;
      overlayContainer = oc;
    })
  );

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(mockMatDialog.open).toHaveBeenCalledWith(SessionExpiradaDialogComponent, {width: '335px',
      data: {},
      disableClose: true,
      autoFocus: false});
  });
});
