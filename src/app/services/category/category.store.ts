import { Injectable } from '@angular/core';
import { ActiveState, EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Category } from './category';

export interface CategoryState extends EntityState<Category, string>, ActiveState<string> {}


@Injectable({ providedIn: 'root' })
@StoreConfig({
  name: 'categories',
  cache: {
    ttl: 24 * 60 * 60 * 1000 // 1day
  }
})
export class CategoryStore extends EntityStore<CategoryState> {
  constructor() {
    super();
  }
}
