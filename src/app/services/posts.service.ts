import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators'

import { Post } from 'src/app/models';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(
    private storage: AngularFireStorage,
    private afs: AngularFirestore,
    private toastr: ToastrService,
    private router: Router) { }

  createNewOrUpdatePost(postData: Post, selectedImg: string, formStatus: string, id: string) {
    const filePath = `postImg/${Date.now()}`;
    this.storage.upload(filePath, selectedImg).then(() => {
      this.storage.ref(filePath).getDownloadURL().subscribe(URL => {
        postData.postImgPath = URL;
        if (formStatus == 'Edit') {
          this.updateData(id, postData);
        } else {
          this.saveData(postData);
        }
      })
    })
  }

  saveData(data: Post) {
    this.afs.collection('posts').add(data).then(docRef => {
      this.toastr.success("New posts created successfully ..!");
      this.router.navigate(["/posts"])
    }).catch(error => this.toastr.error("Have an error, please try again"))
  }

  loadData() {
    return this.afs.collection('posts').snapshotChanges().pipe(
      map(actions => actions.map(a => ({
        id: a.payload.doc.id,
        data: a.payload.doc.data()
      })))
    )
  }

  loadOneData(id: string) {
    return this.afs.doc(`posts/${id}`).valueChanges()
  }

  updateData(id: string, postData: Post) {
    this.afs.doc(`posts/${id}`).update(postData).then(() => {
      this.toastr.success('Data updated successfully');
      this.router.navigate(['/posts']);
    })
  }

  deleteImage(postImgPath: string) {
    this.storage.storage.refFromURL(postImgPath).delete().then(() => {
      this.toastr.warning('Data deleted ..!');
    })
  }

  deleteData(id: string, postImgPath: string) {
    this.afs.doc(`posts/${id}`).delete().then(() => {
      this.deleteImage(postImgPath);
    })
  }

  markFeatured(id: string, featured: any) {
    this.afs.doc(`posts/${id}`).update(featured).then(() => {
      this.toastr.success('Featured status updated ..!');
    })
  }
}
