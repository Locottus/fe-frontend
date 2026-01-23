import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SessionExpiradaDialogComponent } from 'src/app/shared/components/session-expirada-dialog/session-expirada-dialog.component';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  dialogRef: MatDialogRef<any> = null;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.dialogRef = this.dialog.open(SessionExpiradaDialogComponent, {
      width: '335px',
      data: {},
      disableClose: true,
      autoFocus: false,
    });
  }
}
