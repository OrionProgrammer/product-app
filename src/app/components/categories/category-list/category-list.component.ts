import { Component, OnInit, effect, inject } from '@angular/core';
import { CategoryStore } from '../../../stores/category.store';
import { UserStore } from '../../../stores/user.store';
import { Category } from '../../../models/category.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink],
  providers: [CategoryStore],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit{
  categories!: Category[];

  private readonly categoryStore = inject(CategoryStore);
  private readonly userStore = inject(UserStore);

  constructor(){
    effect(() => {
      this.categories = this.categoryStore.categoryList();
    });
  }

  ngOnInit(): void {
    const userId = this.userStore.user().id;
    this.categoryStore.getAllByUserId(userId);
  }

}
