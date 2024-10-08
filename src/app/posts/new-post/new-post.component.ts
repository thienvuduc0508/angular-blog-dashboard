import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Post } from 'src/app/models';
import { CategoriesService, PostsService } from 'src/app/services';

const PLACEHOLDER_IMAGE = './assets/images/placeholder.jpg';
@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss']
})
export class NewPostComponent implements OnInit {
  permalink: string = '';
  imgSrc: any = PLACEHOLDER_IMAGE;
  selectedImg: any;

  categories: any = [];

  postForm: any;

  constructor(private categoryService: CategoriesService, private fb: FormBuilder, private postService: PostsService) { 
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      permalink: ['', Validators.required],
      excerpt: ['', [Validators.required, Validators.minLength(50)]],
      category: ['', Validators.required],
      postImg: ['', Validators.required],
      content: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.categoryService.loadData().subscribe(val => {
      this.categories = val || [];
    })
  }

  get fc() {
    return this.postForm.controls;
  }

  onTitleChanged(e: any) {
    const title = e.target.value;
    const transformPermalink = title.replace(/\s/g, '-');
    this.postForm.patchValue({ permalink: transformPermalink }, { emitEvent: false });
  }

  showPreview(event: any) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imgSrc = e.target?.result;
    }
    reader.readAsDataURL(event.target.files[0]);
    this.selectedImg = event.target.files[0];
  }

  onSubmit() {
    let categorySplitted = this.postForm.value.category.split('-');
    const postData: Post = {
      title: this.postForm.value.title,
      permalink: this.postForm.value.permalink,
      category: {
        categoryId: categorySplitted[0],
        category: categorySplitted[1]
      },
      postImgPath: '',
      excerpt: this.postForm.value.excerpt,
      content: this.postForm.value.content,
      isFeatured: false,
      views: 0,
      status: 'new',
      createAt: new Date()
    }
    this.postService.createNewPost( postData, this.selectedImg);
    this.postForm.reset();
    this.imgSrc = PLACEHOLDER_IMAGE;
  }

}
