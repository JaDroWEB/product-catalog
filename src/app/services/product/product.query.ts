import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { ProductState, ProductStore } from './product.store';

@Injectable({ providedIn: 'root' })
export class ProductQuery extends QueryEntity<ProductState> {
  filter$ = new BehaviorSubject<string[]>([]);

  constructor(protected override store: ProductStore) {
    super(store);
  }

  selectFiltered() {
    return combineLatest([this.selectAll(), this.filter$])
      .pipe(
        map(([all, ids]) => ids.length === 0 ? all : all.filter(one => ids.includes(one.id)))
      )
  }
}
