import { Component, OnInit, ViewChild, effect, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { AlertService } from '../../../services/alert/alert.service';
import { UserStore } from '../../../stores/user.store';
import { CommonModule } from '@angular/common';
import Validation from '../../business-rules/validation';
import { Category } from '../../../models/category.model';
import { UserCategory } from '../../../models/userCategory.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryStore } from '../../../stores/category.store';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [CategoryStore],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent implements OnInit {
  form!: FormGroup;
  id!: number;
  isAddMode!: boolean;
  loading = false;
  submitted = false;
  category!: Category;
  isActive!: boolean;

  private readonly formBuilder = inject(FormBuilder);
  private readonly categoryStore = inject(CategoryStore);
  private readonly alertService = inject(AlertService);
  private readonly route = inject(ActivatedRoute);
  private readonly userStore = inject(UserStore);


  constructor(){
    //if category exists then patch the value to the form
    //this will work when we are loading an existing record to update
    effect(() => {
      this.form.patchValue(this.categoryStore.category());
      this.isActive = this.categoryStore.category().isActive;
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      code: ['', [Validators.required, Validation.codeValidator()]],
      isActive: ['', ],
    });
    this.isActive = false;

    if (!this.isAddMode) {
      const userCategory: UserCategory = {
        userId: this.userStore.user.id(),
        categoryId: this.id,
      };

      //fetch the category from store
      this.categoryStore.getSingle(userCategory);
    }
  }

  //create new category
  add() {
    this.loading = this.userStore.isLoading();

    //create object for add
    this.category = {
      categoryId: 0,
      name: this.f['name']?.value,
      code: this.f['code']?.value,
      isActive: this.isActive,
    };

    const parms = {
      categoryModel: this.category,
      userId: this.userStore.user.id(),
    };

    //execute add process
    this.categoryStore.add(parms);
  }
  
  //update customer
  private update() {
    this.category = this.form.value;
    
    const parms = {
      categoryModel: this.category,
      userId: this.userStore.user.id(),
    };

    this.categoryStore.update(parms)
}

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.close();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    if (this.isAddMode) {
      this.add();
    } else {
      this.update();
    }
  }

  isActiveChanged(event: any){
    this.isActive = event.target.checked;
 }

 //getter for form fields
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
