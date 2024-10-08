import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/services';

@Component({
  selector: 'app-all-post',
  templateUrl: './all-post.component.html',
  styleUrls: ['./all-post.component.scss']
})
export class AllPostComponent implements OnInit {

  constructor(private postService: PostsService) { }

  ngOnInit(): void {
    this.postService.loadData().subscribe(val => console.log(val)
    )
  }

}
