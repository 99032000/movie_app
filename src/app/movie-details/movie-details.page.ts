import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Comment } from '../Comment.model';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  styleUrls: ['./movie-details.page.scss'],
})
export class MovieDetailsPage implements OnInit {
  information = null;
  showInputfield: boolean;
  inputString: string;
  items: Observable<Comment[]>;
  constructor(private activatedRoute: ActivatedRoute,
    private movieService: MovieService, private iab: InAppBrowser,
    private afAuth: AngularFireAuth,
    private afstore: AngularFirestore) {
    this.showInputfield = false;
  }

  ngOnInit() {
    let id = this.activatedRoute.snapshot.paramMap.get('id');

    this.movieService.getDetails(id).subscribe(result => {
      console.log('details: ', result);
      this.information = result;
    });
    this.items = this.afstore.collection<Comment>('comments', ref => ref.where('movieID', '==', id)).valueChanges();
    console.log(this.items);
  }
  openWebsite() {
    this.iab.create(this.information.Website, '_system');

  }

  displayInput() {
    if (this.showInputfield) { this.showInputfield = false; } else { this.showInputfield = true; }
  }
  updateDetail() {
    this.afstore.collection('comments').add({
      movieID: this.activatedRoute.snapshot.paramMap.get('id'),
      comment: this.inputString,
      userID: this.afAuth.auth.currentUser.uid,
      userDisplayName: this.afAuth.auth.currentUser.displayName,
      portrait: this.afAuth.auth.currentUser.photoURL
    });
    this.inputString = '';
  }
}
