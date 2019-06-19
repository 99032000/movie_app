import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import {  AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { ToastController, ActionSheetController, LoadingController } from '@ionic/angular';
import { Portrait } from '../User.model';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})

export class Tab3Page {

  // private uploadtask: firebase.storage.UploadTask;
  itemsDoc: AngularFirestoreDocument;
  email: string;
  //image: string;
  inputString : string;
  toasted: any;
  downloadURL: Observable<string>;
  uploadPercent: Observable<number>;
  //showProgress = false;
  showInputfield : boolean;
  imageURL: any;
  //profile = {} as Portrait;
  constructor(private afAuth: AngularFireAuth,
    private gplus: GooglePlus,
    private platform: Platform,
    private camera: Camera,
    private afs: AngularFireStorage,
    private afstore: AngularFirestore,
    private toast: ToastController,
    private actionSheetController: ActionSheetController) {
    this.showInputfield = false;
    this.afAuth.auth.onAuthStateChanged(user => {
      if (user) {
        this.email = user.email;
        //console.log(this.afstore.collection('portaits'));
        this.afstore.collection('portraits').doc<any>(this.email).valueChanges().subscribe((data) => {
          if (data) {
            this.imageURL = data.downloadURL;
          } else {
            this.imageURL = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';
          }
        });


      }
    });
    // this.afAuth.auth.currentUser.updateProfile({

    // });

    //this.imageURL.downloadURL = this.imageURL.downloadURL;
  }
  updateProfile(){
    this.afAuth.auth.currentUser.updateProfile({
      displayName: this.inputString
    });
    this.inputString = '';
  }
  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePhoto(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePhoto(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async takePhoto(source: any) {
    try {
      const options: CameraOptions = {
        quality: 60,
        targetHeight: 600,
        targetWidth: 600,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        // saveToPhotoAlbum: true
        sourceType: source
      };
      const result = await this.camera.getPicture(options).then((data) => {

        const image = 'data:image/jpeg;base64,' + data;
        //this.image = image;
        const filepath = 'portraits/' + this.email;
        const fileRef = this.afs.ref(filepath);
        //this.showProgress = true;
        const task = this.afs.ref(filepath).putString(image, firebase.storage.StringFormat.DATA_URL);
        this.uploadPercent = task.percentageChanges();
        fileRef.getDownloadURL().subscribe(url => {
          this.afAuth.auth.currentUser.updateProfile({
            photoURL: url
          });
          this.afstore.collection('portraits').doc(this.email).set({
            downloadURL: url
          });
        });
        //this.showProgress = false;

      });

    } catch (e) {
      console.error(e);
    }
  }

  async presentToast(m: string) {
    const toast = await this.toast.create({
      message: m,
      duration: 2000
    });
    toast.present();
  }
  // async takeImage() {
  //   try {
  //     const options: ImagePickerOptions = {
  //       maximumImagesCount: 1,
  //       //outputType:1
  //     };

  //     const result = await this.imagepicker.getPictures(options).then((results) => {
  //       const image = 'data:image/jpeg;base64,' + results[0];
  //       this.image = image;
  //       const filepath = 'portraits/' + this.email;
  //       const fileRef = this.afs.ref(filepath);

  //       const task = this.afs.ref(filepath).putString(image,);
  //       ///this.uploadPercent = task.percentageChanges();
  //       // fileRef.getDownloadURL().subscribe(url => {
  //       //   this.afstore.collection('portraits').doc('imagepickerTester').set({
  //       //     downloadURL: url
  //       //   });
  //       // });
  //     });
  //     this.presentToast(this.image);
  //   } catch (e) {
  //     this.presentToast('??????');
  //     console.error(e);
  //   }
  // }




  // all below is login function

  googleLogin() {
    if (this.platform.is('cordova')) {
      this.nativeGoogleLogin();
    } else {
      this.webGoogleLogin();
    }
  }
  async nativeGoogleLogin(): Promise<firebase.auth.UserCredential> {
    try {

      const gplusUser = await this.gplus.login({
        webClientId: '1049109689091-ka46q0sri4hhfvmmsa4dqrndqvl8ec86.apps.googleusercontent.com',
        offline: true,
        scopes: 'profile email'
      });

      return await this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken));

    } catch (err) {
      console.log(err);
    }
  }
  async webGoogleLogin(): Promise<void> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const credential = await this.afAuth.auth.signInWithPopup(provider);

    } catch (err) {
      console.log(err);
    }

  }

  changePortrait() {

  }
  signOut() {
    this.afAuth.auth.signOut().then(() => {
      // location.reload();
    }).catch();
  }

  ShowInput() {
    if (this.showInputfield) {this.showInputfield = false; } else { this.showInputfield = true; }

  }
}
