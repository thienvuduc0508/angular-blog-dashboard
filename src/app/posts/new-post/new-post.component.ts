import { Component, OnInit } from '@angular/core';
import { CategoriesService } from 'src/app/services';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss']
})
export class NewPostComponent implements OnInit {
  permalink: string = '';
  imgSrc: any = './assets/images/placeholder.jpg';
  selectedImg: any;

  categories: any = [];

  constructor(private categoryService: CategoriesService) { }

  ngOnInit(): void {
    this.categoryService.loadData().subscribe(val => {
      this.categories = val || [];
    })
  }

  onTitleChanged(e: any) {
    const title = e.target.value;
    this.permalink = title.replace(/\s/g, '-');
  }

  showPreview(event: any) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imgSrc = e.target?.result;
    }
    reader.readAsDataURL(event.target.files[0]);
    this.selectedImg = event.target.files[0];
  }

}
