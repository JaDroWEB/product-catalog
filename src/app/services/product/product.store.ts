import { Injectable } from '@angular/core';
import { ActiveState, EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Product } from './product';

export interface ProductState extends EntityState<Product, string>, ActiveState<string> {}


@Injectable({ providedIn: 'root' })
@StoreConfig({
  name: 'products',
  cache: {
    ttl: 24 * 60 * 60 * 1000 // 1day
  }
})
export class ProductStore extends EntityStore<ProductState> {
  constructor() {
    super();
  }
}
