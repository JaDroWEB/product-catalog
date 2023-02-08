import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ProductQuery } from 'src/app/services/product/product.query';
import { EditProductComponent } from './edit-product/edit-product.component';
import { Product } from 'src/app/services/product/product';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  product!: Product | undefined;

  constructor(
    private productQuery: ProductQuery,
    private dialog: MatDialog,
    private location: Location
  ) {
    this.productQuery
      .selectActive()
      .pipe(untilDestroyed(this))
      .subscribe(prod => this.product = prod)
  }

  edit() {
    this.dialog.open(EditProductComponent, {
      width: '600px'
    });
  }

  back() {
    this.location.back();
  }
}
