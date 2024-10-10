import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-post',
  templateUrl: './all-post.component.html',
  styleUrls: ['./all-post.component.scss']
})
export class AllPostComponent implements OnInit {
  postList: any = [];

  constructor(private postService: PostsService) { }

  ngOnInit(): void {
    this.postService.loadData().subscribe(val => this.postList = val)
  }

  trackList(index : number, post: any) {
    return post?.id || undefined;
  }

  onDelete(id: string, path: string) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.postService.deleteData(id, path);
        Swal.fire({
          title: "Deleted!",
          text: "Your post has been deleted.",
          icon: "success"
        });
      }
    });
  }

  onFeatured(id: string, status: boolean) {
    const featuredData = {
      isFeatured: status
    }
    this.postService.markFeatured(id, featuredData)
  }

}
