import { Component, OnInit } from '@angular/core';
import {MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-info-dialog',
  template: `
    <p>
      info-dialog Works!
      {{ metadata.createdTime }}
    </p>
    <button md-raised-button (click)="close()">Cancel</button>
  `,
  styles: []
})
export class InfoDialogComponent {

  public metadata;

  constructor(public dialogRef: MdDialogRef<InfoDialogComponent>) {

  }

  public close() {
    this.dialogRef.close('closing dialog...');
  }

}
