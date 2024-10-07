import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { Category } from 'src/app/models/category';
import { CategoriesService } from 'src/app/services';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  categoryList: any[] = [];
  editId: string = '';
  constructor(private service: CategoriesService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    this.service.loadData().subscribe(val => {
    this.categoryList = val;      
    })
  }

  submit(formData: any) {
    if(!formData.value.category || !(formData.value.category).trim()) {
      this.toastr.error('Invalid category name!');
      return;
    }
    let categoryData: Category = {
      category: formData.value.category
    }
    this.service.saveData(categoryData);
    formData.reset();
  }

  handleEdit(categoryId: string) {
    this.editId = categoryId;
  }

  saveEdit(id: string, value: string) {
    if (!id || !value || !value.trim()) {
      this.toastr.error('Invalid category name, Please try again!')
      return;
    }
    this.service.updateData(id, {category: value});
    this.editId = '';
  }

  cancelEdit() {
    this.editId = '';
  }

  onDelete(categoryId: string) {
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
        this.service.deleteData(categoryId);
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    });
  }

  trackCategory(index : number, category: any) {
    return category ? category.id : undefined;
};

}
