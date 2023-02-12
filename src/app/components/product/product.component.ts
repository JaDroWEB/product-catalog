import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ProductQuery } from 'src/app/services/product/product.query';
import { EditProductComponent } from './edit-product/edit-product.component';
import { shareReplay, tap } from 'rxjs';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  product = this.productQuery.selectActive().pipe(shareReplay());

  constructor(
    private productQuery: ProductQuery,
    private dialog: MatDialog,
    private location: Location
  ) {}

  edit() {
    this.dialog.open(EditProductComponent, {
      width: '600px'
    });
  }

  back() {
    this.location.back();
  }
}
