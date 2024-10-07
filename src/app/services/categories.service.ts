import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators'
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/models/category';


@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private afs: AngularFirestore, private toastr: ToastrService) { }

  loadData() {
    return this.afs.collection('categories').snapshotChanges().pipe(
      map(actions => actions.map(a => ({
        id: a.payload.doc.id,
        data: a.payload.doc.data()
      })))
    )
  }
  saveData(data: Category) {
    this.afs.collection('categories').add(data)
    .then(docRef => {
      this.toastr.success('Data inserted successfully ..!');
    })
    .catch((err) => console.log(err)
    )
  }

  updateData(id: string, data: Category) {
    this.afs.doc(`categories/${id}`).update(data)
    .then(docRef => {
      this.toastr.success('Data updated successfully ..!')
    })
  }

  deleteData(id: string) {
    this.afs.doc(`categories/${id}`).delete();
  }
}
