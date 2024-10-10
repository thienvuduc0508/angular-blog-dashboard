import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models';
import { CategoriesService, PostsService } from 'src/app/services';

const PLACEHOLDER_IMAGE = './assets/images/placeholder.jpg';
@Component({
  selector: 'app-new-update-post',
  templateUrl: './new-update-post.component.html',
  styleUrls: ['./new-update-post.component.scss']
})
export class NewUpdatePostComponent implements OnInit {
  permalink: string = '';
  imgSrc: any = PLACEHOLDER_IMAGE;
  selectedImg: any;

  categories: any = [];

  postForm: any;
  post: any;
  formStatus: string = 'Add new';
  postId: string = '';

  constructor(
    private categoryService: CategoriesService,
    private fb: FormBuilder,
    private postService: PostsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.categoryService.loadData().subscribe(val => {
      this.categories = val || [];
    });

    this.route.queryParams.subscribe((val: any) => {
      this.postId = val?.id;
      if (this.postId) {
        this.postService.loadOneData(this.postId).subscribe(post => {
          this.post = post;
          this.postForm = this.fb.group({
            title: [this.post.title, [Validators.required, Validators.minLength(10)]],
            permalink: [this.post.permalink, Validators.required],
            excerpt: [this.post.excerpt, [Validators.required, Validators.minLength(50)]],
            category: [`${this.post.category.categoryId}-${this.post.category.category}`, Validators.required],
            postImg: ['', Validators.required],
            content: [this.post.content, Validators.required]
          })
          // this.imgSrc = this.post.postImgPath;
          this.formStatus = 'Edit';
        })
      } else {
        this.postForm = this.fb.group({
          title: ['', [Validators.required, Validators.minLength(10)]],
          permalink: ['', Validators.required],
          excerpt: ['', [Validators.required, Validators.minLength(50)]],
          category: ['', Validators.required],
          postImg: ['', Validators.required],
          content: ['', Validators.required]
        })
      }
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
      postImgPath: this.postForm.value.postImg,
      excerpt: this.postForm.value.excerpt,
      content: this.postForm.value.content,
      isFeatured: false,
      views: 0,
      status: 'new',
      createAt: new Date()
    }
    this.postService.createNewOrUpdatePost(postData, this.selectedImg, this.formStatus, this.postId);
    this.postForm.reset();
    this.imgSrc = PLACEHOLDER_IMAGE;
  }

}
