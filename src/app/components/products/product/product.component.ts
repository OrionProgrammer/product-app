import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, computed, effect, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { AlertService } from '../../../services/alert/alert.service';
import { UserStore } from '../../../stores/user.store';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { UserCategory } from '../../../models/userCategory.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductStore } from '../../../stores/product.store';
import { Product } from '../../../models/product.model';
import { CategoryStore } from '../../../stores/category.store';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ImageRecord } from '../../../models/imageRecord';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [ProductStore, CategoryStore, CurrencyPipe],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  form!: FormGroup;
  id!: number;
  isAddMode!: boolean;
  loading = false;
  submitted = false;
  product!: Product;
  userCategory!: UserCategory;
  isActive!: boolean;
  categoryList!: any;
  categoryId!: number;
  imageUrl!: string;
  imageSafeRUrl!: SafeResourceUrl;
  imageRecord!: ImageRecord;
  
  private readonly productStore = inject(ProductStore);
  private readonly userStore = inject(UserStore);
  private readonly categoryStore = inject(CategoryStore);
  private readonly alertService = inject(AlertService);
  private readonly route = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);
  private readonly currencyPipe  = inject(CurrencyPipe);
  private readonly sanitizer = inject(DomSanitizer);

  constructor(){
    //if category exists then patch the value to the form
    //this will work when we are loading an existing record to update
    effect(() => {
      const product = this.productStore.product();
      //this.imageUrl = product.ImageType + ',' + product.ImageBase64String;
      //console.log(JSON.stringify(product));
      //const myimage = atob(this.productStore.imageSrc());
      //console.log('decoded image: ' + myimage);
      //console.log(this.productStore.imageSrc());
      this.imageRecord = product.ImageRecord;

      this.form.patchValue(product);
      this.categoryList = this.categoryStore.categoryList();
      this.selectedCategory = product.categoryId.toString();
    });
  }

  @ViewChild('categorySelected') categorySelected!: ElementRef;
	selectedCategory = '';
	onSelected():void {
		this.categoryId = this.categorySelected.nativeElement.value;
	}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      code: [{value: '', disabled: true}, [Validators.required]],
      description: ['',],
      categoryId: ['', [Validators.required]],
      price: ['', [Validators.required,Validators.pattern("^[0-9]*$"),]],
      ImageBase64String: ['', ],
      isActive: ['', ],
    });
    this.isActive = false;

    this.categoryStore.getAllByUserId(this.userStore.user().id);

    if(!this.isAddMode){
      //fetch the product from store
      this.productStore.getSingle(this.id);
    }
  }

  //create new product
  add() {
    this.loading = this.userStore.isLoading();

    //create object for add
    this.product = {
      productId: 0,
      name: this.f['name']?.value,
      code: this.f['code']?.value,
      description: this.f['description']?.value,
      price: this.f['price']?.value,
      ImageBase64String: this.imageUrl,
      ImageType: '', //this is used for fetching from db
      ImageRecord: {name: '', imgUrlSafe: ''},
      Image: '', 
      categoryId: this.categoryId,
    };

    this.userCategory =  {
      userId: this.userStore.user().id,
      categoryId: this.categoryId
    }

    const parms = {
      productModel: this.product,
      userCategoryModel: this.userCategory
    }

    //execute add process
    this.productStore.add(parms);
  }
  
  //update product
  private update() {
    this.product = this.form.value;

    this.product.productId = this.id;
    this.product.categoryId = this.categoryId;
    this.product.ImageBase64String = this.imageUrl;

    this.productStore.update(this.product)
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

 transformAmount(element: any){
  const formattedValue = this.currencyPipe.transform(element.target.value);
  this.f['price'].setValue(formattedValue);
}

onFileChange(event: any) {
  const reader = new FileReader();
  if (event.target.files && event.target.files[0]) {
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };
  }
}

 //getter for form fields
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
