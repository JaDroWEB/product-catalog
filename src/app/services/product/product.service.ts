import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { setLoading } from '@datorama/akita';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from './product';
import { ProductQuery } from './product.query';
import { ProductStore } from './product.store';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(
    private productStore: ProductStore,
    private productQuery: ProductQuery,
    private http: HttpClient
  ) {}

  getAll() {
    return this.productQuery.selectHasCache().pipe(
      switchMap(hasCache => {
        const request$ = this.http.get<Product[]>(`${environment.dataApi}products.json`).pipe(
          setLoading(this.productStore),
          tap(categories => this.productStore.set(categories)),
          catchError(() => EMPTY)
        );

        return hasCache ? EMPTY : request$;
      })
    );
  }
}
