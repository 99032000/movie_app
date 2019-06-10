import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(private afAuth: AngularFireAuth,) {}

  signOut(){
    this.afAuth.auth.signOut().then(() => {
      //location.reload();
    }).catch();
  }
}
