import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchType, MovieService } from '../services/movie.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  
  results: Observable<any>;
  searchTerm = '';
  type: SearchType = SearchType.all;

  constructor(private movieService: MovieService) {}

  searchChanged(){
    this.results = this.movieService.searchData(this.searchTerm, this.type);
    // console.log('My result: ', this.results);
    // this.results.subscribe(res => {
      
    // });
  }
}
