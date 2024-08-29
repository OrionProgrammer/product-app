import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';
import { environment } from '../../../environments/environment.development';
import { UserCategory } from '../../models/userCategory.model';
import { Paging } from '../../models/paging.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = environment.apiUrl + '/product';
  private readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  add(product: Product, userCategory: UserCategory): Observable<Product> {
    return this.http.post<Product>(
      `${this.apiUrl}`,
      JSON.stringify({
        productModel: product,
        userCategoryModel: userCategory,
      }),
      this.httpOptions
    );
  }

  update(product: Product): Observable<Product> {
    return this.http.put<Product>(
      `${this.apiUrl}`,
      JSON.stringify(product),
      this.httpOptions
    );
  }

  delete(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}`);
  }

  getSingle(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/get-product/${productId}`);
  }

  getPagedList(userId: number, start: number, length: number): Observable<any> {
    return this.http.get<Product[]>(`${this.apiUrl}/list`, {
      params: {
        userId: userId,
        start: start,
        length: length,
      },
    });
  }

  export(userId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/` + userId, { responseType: 'blob' });
  }

  import(file: File, userId: number): Observable<Product[]> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Product[]>(`${this.apiUrl}/import/` + userId, formData);
  }
}
