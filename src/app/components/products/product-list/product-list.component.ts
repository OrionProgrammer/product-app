import { Component, OnInit, effect, inject } from '@angular/core';
import { ProductStore } from '../../../stores/product.store';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { UserStore } from '../../../stores/user.store';
import { ProductService } from '../../../services/product/product.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink],
  providers: [ProductStore, ProductService, CurrencyPipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  isExporting = false;
  isImporting = false;

  products: any[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;

  private readonly productStore = inject(ProductStore);
  private readonly userStore = inject(UserStore);
  private readonly productService = inject(ProductService);
  private readonly currencyPipe = inject(CurrencyPipe);

  constructor() {
    effect(() => {
      this.isExporting = this.productStore.isExporting();
      this.isImporting = this.productStore.isImporting();

      if(this.productStore.isImportComplete() === true || this.productStore.isProductDeleted() === true){
        this.reloadProducts();
      }
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    const userId = this.userStore.user().id;
    const start = (this.currentPage - 1) * this.pageSize;
    this.productService
      .getPagedList(userId, start, this.pageSize)
      .subscribe((response) => {
        this.products = response.data;
        this.totalRecords = response.recordsTotal;
      });
  }

  delete(productId: number) : void{
    this.productStore.delete(productId);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  export() {
    const userId = this.userStore.user().id;
    this.productStore.export(userId);
  }

  import(event: any) {
    const file = event.target.files[0];
    const userId = this.userStore.user().id;

    const parms = {
      file: file,
      userId: userId,
    };

    this.productStore.import(parms);
    
  }

  reloadProducts() {
    this.products = [];
    this.totalRecords = 0;
    this.currentPage = 1;
    this.pageSize = 10;

    this.loadProducts();
  }
}
