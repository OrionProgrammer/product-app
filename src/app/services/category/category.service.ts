import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../../models/category.model';
import { environment } from '../../../environments/environment.development';
import { UserCategory } from '../../models/userCategory.model';
import { Paging } from '../../models/paging.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = environment.apiUrl+ '/category';
  private readonly httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  constructor(private http: HttpClient) {}

  add(category: Category, userId: number): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/${userId}`, JSON.stringify(category), this.httpOptions);
  }

  update(category: Category, userId: number): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${userId}`, JSON.stringify(category), this.httpOptions);
  }

  delete(userCategory: UserCategory): Observable<void> {
    const options = {
      body: {
        userId: userCategory.userId,
        categoryId: userCategory.categoryId
      }
    }

    return this.http.delete<void>(`${this.apiUrl}`, options);
  }

  getSingle(userCategory: UserCategory): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/get-category/` + userCategory.userId + '/' + userCategory.categoryId, this.httpOptions)
  }

  getAllbyUserId(userId: number): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/get-all/` + userId, this.httpOptions)
  }

}