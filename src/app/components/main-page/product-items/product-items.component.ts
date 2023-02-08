import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { CategoryQuery } from 'src/app/services/category/category.query';
import { ProductQuery } from 'src/app/services/product/product.query';
import { ProductService } from 'src/app/services/product/product.service';
import { ProductStore } from 'src/app/services/product/product.store';

@UntilDestroy()
@Component({
  selector: 'app-product-items',
  templateUrl: './product-items.component.html',
  styleUrls: ['./product-items.component.scss']
})
export class ProductItemsComponent implements OnInit {
  option$ = new BehaviorSubject<string>('Name');
  isLoading$ = this.productQuery.selectLoading();
  activeCategoryName$ = this.categoryQuery.selectActive().pipe(map(category => category?.name));

  products$ = combineLatest([
    this.productQuery.selectAll(),
    this.route.queryParams.pipe(map(params => {
      let filters = params['active'] ? [params['active'] as string] : [];
      Array.isArray(params['filter']) ? filters.push(...params['filter']) : null;
      return filters;
    })),
    this.option$
  ]).pipe(
    map(([products, filters, sort]) =>
      products
        .filter(product => filters.includes('all') || filters?.includes(product.categoryId))
        .sort((a, b) => sort === 'Price' ? a.price - b.price : a.name.localeCompare(b.name))
    )
  );

  @Output() sidenavToogle = new EventEmitter<boolean>();
  @Input() innerWidth!: number;

  constructor(
    productService: ProductService,
    private categoryQuery: CategoryQuery,
    private productQuery: ProductQuery,
    private productStore: ProductStore,
    private route: ActivatedRoute,
    private router: Router
  ) {
    productService.getAll().pipe(untilDestroyed(this)).subscribe();
  }

  ngOnInit(): void {
  }

  removeProduct(id: string) {
    this.productStore.remove(id);
  }

  openDetails(id: string) {
    this.productStore.setActive(id);
    this.router.navigate([`product/${id}`], {
      relativeTo: this.route,
      queryParams: null
    });
  }

  toggleSidenav() {
    this.sidenavToogle.emit(true);
  }
}
