import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { CategoryState, CategoryStore } from './category.store';

@Injectable({ providedIn: 'root' })
export class CategoryQuery extends QueryEntity<CategoryState> {
  constructor(protected override store: CategoryStore) {
    super(store);
  }
}
