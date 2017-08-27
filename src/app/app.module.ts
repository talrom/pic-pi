import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {CompComponent} from './comp/comp.component';
import {FormsModule} from '@angular/forms';
import {ClientConfig, GoogleApiModule, NG_GAPI_CONFIG} from 'ng-gapi';
import {MdDialogModule, MdButtonModule} from '@angular/material';
import {InfoDialogComponent} from './info-dialog/info-dialog.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

let gapiClientConfig: ClientConfig = {
  clientId: 'CLIENT_ID_HERE',
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
  scope: [
    'https://www.googleapis.com/auth/drive.metadata.readonly',
  ].join(' ')
};

@NgModule({
  declarations: [
    AppComponent,
    CompComponent,
    InfoDialogComponent,
  ],
  entryComponents: [
    InfoDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    GoogleApiModule.forRoot({
      provide: NG_GAPI_CONFIG,
      useValue: gapiClientConfig
    }),
    BrowserAnimationsModule,
    MdDialogModule,
    MdButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
