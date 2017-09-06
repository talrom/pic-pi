import {Component, OnInit, ApplicationRef, NgZone} from '@angular/core';
import {GoogleApiService, GoogleAuthService} from 'ng-gapi';
import GoogleUser = gapi.auth2.GoogleUser;
import {MdDialog, MdDialogRef} from '@angular/material';
import {InfoDialogComponent} from '../info-dialog/info-dialog.component';

declare const gapi: any;

@Component({
  selector: 'app-comp',
  template: `
    <p>
      comp Works!
    </p>
    <div>
      <input type="text" (input)="txt = $event.target.value">
      <button (click)="hello()">hello!</button>
      <p>txt is: {{txt}}</p>
    </div>
    <div class="">
      <img [src]='currentImg' class="img-props" [style.transform]='rotationOffset'>

      <div class="fixed-action-btn horizontal click-to-toggle">
        <a class="btn-floating btn-large red">
          <i class="material-icons">menu</i>
        </a>
        <ul>
          <li><a class="btn-floating yellow darken-1" (click)="openDialog()"><i class="material-icons">info_outline</i></a></li>
          <li><a class="btn-floating green" (click)="listFolders()"><i class="material-icons">folder</i></a></li>
          <li><a class="btn-floating blue" (click)="runAllflow()"><i class="material-icons">shuffle</i></a></li>
        </ul>
      </div>
  `,
  styleUrls: ['./comp.component.css']
})
export class CompComponent implements OnInit {

  public txt: string;
  public currentImg: string;
  public rotationOffset: string;
  public googleAuth: GoogleAuthService;
  public currentImgData;
  public appRef: ApplicationRef;

  constructor(public dialog: MdDialog, public zone: NgZone, appRef: ApplicationRef, gapiService: GoogleApiService,
              gapiAuth: GoogleAuthService, googleAuth: GoogleAuthService) {
    this.appRef = appRef;
    this.googleAuth = googleAuth;
    this.txt = '';
    this.rotationOffset = 'rotate(0deg)';
    gapiService.onLoad(() => {
      console.log('gapi service was loaded!');
      this.signIn();
      gapi.load('client:auth2', this.loadDriveAPI);

    });
  }

  public loadDriveAPI() {
    gapi.client.load('drive', 'v3');
  }

  public signIn(): void {
    this.googleAuth.getAuth()
      .subscribe((auth) => {
        auth.signIn().then(res => this.signInSuccessHandler(res));
      });
  }

  private signInSuccessHandler(res: GoogleUser) {
    console.log('got user: ' + res.getBasicProfile().getName());
  }

  ngOnInit() {

  }

  public hello(input: string) {
    console.log('clicked!');
    alert(this.txt);
  }

  public listFolders() {
    gapi.client.drive.files.list({
      'pageSize': 1000,
      'q': 'mimeType = "application/vnd.google-apps.folder" and trashed = false',
      'fields': 'nextPageToken, files(id, name, webContentLink, webViewLink, createdTime, parents)'
    }).then((response) => {
      console.log('Files:');
      const files = response.result.files;
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          console.log(file.name + ' (' + file.id + ')' + ' webViewLink:' + file.webViewLink + ' webContentLink:' +
            file.webContentLink + ' parents:' + file.parents);
        }
      } else {
        console.error('No files found.');
      }
    });
  }

  /**
   * the method returns all google drive folders under /photos directory and choose random folder from the list
   * this ID: 1tCTU7t5Y3IkVmZgrzhGcctjQA9bqDw9Av2z2RS4Pjss is google photos folder ID in gDrive
   * @returns {string folder ID from gDrive}
   */
  public getRandomFolder(): Promise<string> {
    return new Promise((resolve, reject) => {
      const folderQuery = '"1tCTU7t5Y3IkVmZgrzhGcctjQA9bqDw9Av2z2RS4Pjss" in parents and trashed = false and ' +
        'mimeType = "application/vnd.google-apps.folder"'
      gapi.client.drive.files.list({
        'pageSize': 1000,
        'q': 'mimeType = "application/vnd.google-apps.folder" and trashed = false',
        'fields': 'nextPageToken, files(id, name, webContentLink, webViewLink, createdTime, parents)'
      }).then((response) => {
        const files = response.result.files;
        const randomFolder = files[Math.floor(Math.random() * files.length)];
        console.log('** folder id is: ' + randomFolder.id);
        resolve(randomFolder.id);
      });
    });
  }

  public getRandomImg(folderId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const query: string = '"%s" in parents and trashed = false and mimeType != "application/vnd.google-apps.folder" and mimeType contains "image/"'
        .replace('%s', folderId);
      gapi.client.drive.files.list({
        'pageSize': 1000,
        'q': query,
        'fields': 'files(id, name, webContentLink, webViewLink, createdTime, parents, imageMediaMetadata)'
      }).then((response) => {
        const imgs = response.result.files;
        this.currentImgData = imgs[Math.floor(Math.random() * imgs.length)];
        console.log('going to display' + this.currentImgData.id + ' date: ' + this.currentImgData.createdTime + ' rotation: ' +
          this.currentImgData.imageMediaMetadata.rotation);
        console.log(this.currentImgData);
        resolve(this.currentImgData);
      });
    });
  }

  public runAllflow() {
    this.getRandomFolder().then((folderId) => {
      console.log('got the following folder ID: ' + folderId);
      this.getRandomImg(folderId).then((img) => {
        console.log('got the following image data: ' + img);
        this.fixImgRotation(img.imageMediaMetadata.rotation);
        this.currentImg = 'https://drive.google.com/uc?id=' + img.id;
        // this.appRef.tick();
      });
    });
  }

  private fixImgRotation(imgRotationValue: number) {
    console.log('initial rotationOffset is: ' + this.rotationOffset);
    if (imgRotationValue === 1) {
      this.rotationOffset = 'rotate(90deg)';
      console.log('img is 1, setting rotationOffset to: ' + this.rotationOffset);
    } else if (imgRotationValue === 2) {
      this.rotationOffset = 'rotate(180deg)';
      console.log('img is 2, setting rotationOffset to: ' + this.rotationOffset);
    } else {
      this.rotationOffset = 'rotate(0deg)';
      console.log('img rotation is OK (' + imgRotationValue + '), setting rotationOffset to: ' + this.rotationOffset);
    }
  }

  public openDialog() {
    const dialogRef = this.dialog.open(InfoDialogComponent);
    dialogRef.componentInstance.metadata = this.currentImgData;
    dialogRef.afterClosed().subscribe(result => {
      console.log('got the following result from dialog ' + result);
      this.txt = result;
    });
  }

}
