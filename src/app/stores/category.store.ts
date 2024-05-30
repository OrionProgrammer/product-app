import { inject } from '@angular/core';
import { pipe, switchMap, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Category } from '../models/category.model';
import { Paging } from '../models/paging.model';
import { CategoryService } from '../services/category/category.service';
import { UserCategory } from '../models/userCategory.model';
import { AlertService } from '../services/alert/alert.service';
import { AlertType } from '../models/alert.enum';
import { Router } from '@angular/router';

type CategoryState = {
  category: Category;
  categoryList: Category[];
  isLoading: boolean;
  error: string;
};

const emptyCategory = (): Category => ({
  categoryId: 0,
  name: '',
  code: '',
  isActive: true
});

const initialState: CategoryState = {
  category:  emptyCategory(),
  categoryList: [],
  isLoading: false,
  error: ''
};

export const CategoryStore = signalStore(
  withState(initialState),
  withMethods((store, 
    categoryService = inject(CategoryService),
    alertService = inject(AlertService),
    router = inject(Router)) => ({
    add: rxMethod<{ categoryModel: Category; userId: number }>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((model) => {
            return categoryService.add(model.categoryModel, model.userId).pipe(
              tapResponse({
                next: (category: Category) => {
                  patchState(store, { category });
                  alertService.showAlert('Category added!', AlertType.Success);
                  router.navigate(['category/' + category.categoryId]);
                },
                error: (error: any) =>{
                  patchState(store, { error: error});
                  alertService.showAlert('Could not add category, please check your form and try again!. error: ' + JSON.stringify(error), AlertType.Error);
                },
                finalize: () => patchState(store, { isLoading: false }),
              })
            );
          })
        )
      ),
      update: rxMethod<{ categoryModel: Category; userId: number }>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((model) => {
            return categoryService.update(model.categoryModel, model.userId).pipe(
              tapResponse({
                next: (category: Category) => {
                  patchState(store, { category });
                  alertService.showAlert('Category updated!', AlertType.Success);
                },
                error: (error: any) => {
                  patchState(store, { error: error});
                  alertService.showAlert('Could not update category. Please try again. error: ' + error, AlertType.Error);
                },
                finalize: () => patchState(store, { isLoading: false }),
              })
            );
          })
        )
      ),
      delete: rxMethod<UserCategory>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((model) => {
            return categoryService.delete(model).pipe(
              tapResponse({
                next: (c) => {
                  c;
                  alertService.showAlert('Category deleted!', AlertType.Success);
                },
                error: (error: any) => { 
                  patchState(store, { error: error});
                  alertService.showAlert('Category not deleted. {elase try again! error: ' + error, AlertType.Error);
                },
                finalize: () => patchState(store, { isLoading: false }),
              })
            );
          })
        )
      ),
      getSingle: rxMethod<UserCategory>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((model) => {
            return categoryService.getSingle(model).pipe(
              tapResponse({
                next: (category: Category) => { 
                  patchState(store, { category });
                },
                error: (error: any) => {
                  patchState(store, { error: error});
                  alertService.showAlert('An error occured fetching the category!  error: !' + JSON.stringify(error), AlertType.Error);
                },
                finalize: () => patchState(store, { isLoading: false }),
              })
            );
          })
        )
      ),
      getAllByUserId: rxMethod<number>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((model) => {
            return categoryService.getAllbyUserId(model).pipe(
              tapResponse({
                next: (categoryList: Category[]) => patchState(store, { categoryList }),
                error: (error: any) => {
                  patchState(store, { error: error});
                  alertService.showAlert('Error fetching all categories!  error: ' + JSON.stringify(error), AlertType.Error);
                },
                finalize: () => patchState(store, { isLoading: false }),
              })
            );
          })
        )
      ),
  }))
);
