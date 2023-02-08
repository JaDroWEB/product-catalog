import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { setLoading } from '@datorama/akita';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from './category';
import { CategoryQuery } from './category.query';
import { CategoryStore } from './category.store';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(
    private categoryStore: CategoryStore,
    private categoryQuery: CategoryQuery,
    private http: HttpClient
  ) {}

  getAll() {
    return this.categoryQuery.selectHasCache().pipe(
      switchMap(hasCache => {
        const request$ = this.http.get<Category[]>(`${environment.dataApi}product-categories.json`).pipe(
          setLoading(this.categoryStore),
          tap(categories => this.categoryStore.set(categories)),
          catchError(() => EMPTY)
        );

        return hasCache ? EMPTY : request$;
      })
    );
  }
}
