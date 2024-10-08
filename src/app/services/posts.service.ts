import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators'

import { Post } from 'src/app/models';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private storage: AngularFireStorage, private afs: AngularFirestore, private toastr: ToastrService) { }

  createNewPost(postData: Post, selectedImg: string) {
    const filePath = `postImg/${Date.now()}`;
    this.storage.upload(filePath, selectedImg).then(() => {
      this.storage.ref(filePath).getDownloadURL().subscribe(URL => {
        postData.postImgPath = URL;
        console.log(postData);
        
        this.saveData(postData);
      })
    })

  }
  
  saveData(data: Post) {
    this.afs.collection('posts').add(data).then(docRef => {
      this.toastr.success("New posts created successfully ..!");
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
}
