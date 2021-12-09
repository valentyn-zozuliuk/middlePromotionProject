import { Component, OnInit } from '@angular/core';
import { ClearObservable } from 'src/app/shared/clear-observable/clear-observable';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent extends ClearObservable implements OnInit {

  constructor() {
      super();
   }

  ngOnInit(): void {
  }

}
