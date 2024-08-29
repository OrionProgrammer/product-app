import { inject } from '@angular/core';
import { pipe, switchMap, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Product } from '../models/product.model';
import { UserCategory } from '../models/userCategory.model';
import { ProductService } from '../services/product/product.service';
import { AlertService } from '../services/alert/alert.service';
import { Router } from '@angular/router';
import { AlertType } from '../models/alert.enum';
import { saveAs } from 'file-saver';
import { ImageRecord } from '../models/imageRecord';
import { DomSanitizer } from '@angular/platform-browser';


type ProductState = {
  product: Product;
  productList: Product[];
  isImporting: boolean;
  isExporting: boolean;
  isImportComplete: boolean,
  isProductDeleted: boolean,
  isLoading: boolean;
  error: string;
  imageSrc: string;
};

const emptyProduct = (): Product => ({
    productId: 0,
    name: '',
    code: '',
    description: '',
    price: 0,
    ImageBase64String: '',
    ImageType: '',
    ImageRecord: emptyImageRecord(),
    Image: '',
    categoryId: 0,
});

const emptyImageRecord = (): ImageRecord => ({
  name: '',
  imgUrlSafe: '',
});

const initialState: ProductState = {
  product:  emptyProduct(),
  productList: [],
  isImporting: false,
  isExporting: false,
  isImportComplete: false,
  isProductDeleted: false,
  isLoading: false,
  error: '',
  imageSrc: ''
};

export const ProductStore = signalStore(
  withState(initialState),
  withMethods((store, 
    productService = inject(ProductService),
    alertService = inject(AlertService),
    router = inject(Router),
    sanitizer = inject(DomSanitizer)) => ({
    add: rxMethod<{ productModel: Product; userCategoryModel: UserCategory }>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((model) => {
            return productService.add(model.productModel, model.userCategoryModel).pipe(
              tapResponse({
                next: (product: Product) => {
                  patchState(store, { product });
                  alertService.showAlert('Product Added!', AlertType.Success);
                  router.navigate(['product/' + product.productId]);
                },
                error: (error: any) => {
                  patchState(store, { error: error});
                  alertService.showAlert('Product NOt Added!  error: ' + JSON.stringify(error), AlertType.Error);
                },
                finalize: () => patchState(store, { isLoading: false }),
              })
            );
          })
        )
      ),
      update: rxMethod<Product>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((model) => {
            return productService.update(model).pipe(
              tapResponse({
                next: (product: Product) => {
                  patchState(store, { product });
                  alertService.showAlert('Product Updated!', AlertType.Success);
                },
                error: (error: any) => {
                  patchState(store, { error: error});
                  alertService.showAlert('Product Not Updated   error: !' + error, AlertType.Success);
                },
                finalize: () => patchState(store, { isLoading: false }),
              })
            );
          })
        )
      ),
      delete: rxMethod<number>(
        pipe(
          tap(() => patchState(store, { isLoading: true, isProductDeleted: false })),
          switchMap((model) => {
            return productService.delete(model).pipe(
              tapResponse({
                next: (c) => {
                  patchState(store, { isProductDeleted: true });
                  alertService.showAlert('Product Deleted!', AlertType.Success);
                },
                error: (error: any) => {
                  patchState(store, { error: error, isProductDeleted: false });
                  alertService.showAlert('Product Not Deleted!  error: ' + error, AlertType.Error);
                },
                finalize: () => patchState(store, { isLoading: false }),
              })
            );
          })
        )
      ),
      getSingle: rxMethod<number>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((model) => {
            return productService.getSingle(model).pipe(
              tapResponse({
                next: (product: Product) => {
                  const imageToSanitze = product.ImageType + ';' + product.ImageBase64String;
                  product.ImageRecord = new ImageRecord('Product Image', sanitizer.bypassSecurityTrustUrl(imageToSanitze));
                  patchState(store, { product });
                },
                error: (error: any) => {
                  patchState(store, { error: error});
                  alertService.showAlert('Error loading product!  error:' + JSON.stringify(error), AlertType.Error);
                },
                finalize: () => patchState(store, { isLoading: false }),
              })
            );
          })
        )
      ),
      export: rxMethod<number>(
        pipe(
          tap(() => patchState(store, { isExporting: true })),
          switchMap((model) => {
            return productService.export(model).pipe(
              tapResponse({
                next: (blob) => {
                  alertService.showAlert('Products exported!', AlertType.Success);
                  saveAs(blob, 'products.xlsx');
                  patchState(store, { isExporting: false});
                },
                error: (error: any) => {
                  patchState(store, { error: error});
                  alertService.showAlert('Unable to export products!  error: ' + JSON.stringify(error), AlertType.Error);
                },
                finalize: () => patchState(store, { isExporting: false }),
              })
            );
          })
        )
      ),
      import: rxMethod<{ file: File; userId: number }>(
        pipe(
          tap(() => patchState(store, { isImporting: true, isImportComplete: false })),
          switchMap((model) => {
            return productService.import(model.file, model.userId).pipe(
              tapResponse({
                next: () => {
                  alertService.showAlert('Products imported!', AlertType.Success);
                  patchState(store, { isImporting: false, isImportComplete: true});
                },
                error: (error: any) => {
                  patchState(store, { error: error, isImporting: false, isImportComplete: false });
                  alertService.showAlert("Please run the import once more. Sorry about thath :/", AlertType.Warning);
                },
                finalize: () => patchState(store, { isImporting: false }),
              })
            );
          })
        )
      ),
  }))
);
