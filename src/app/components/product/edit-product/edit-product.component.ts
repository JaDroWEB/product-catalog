import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from 'src/app/services/product/product';
import { ProductQuery } from 'src/app/services/product/product.query';
import { ProductStore } from 'src/app/services/product/product.store';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  product = this.productQuery.getActive();
  model = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    description: new FormControl<string>('', Validators.required),
    price: new FormControl<number>(0, Validators.required)
  });

  constructor(
    public dialogRef: MatDialogRef<EditProductComponent>,
    private productQuery: ProductQuery,
    private productStore: ProductStore,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (this.product) {
      this.model.setValue({
        name: this.product.name,
        description: this.product.description,
        price: this.product.price
      });
    }
  }

  save() {
    if (!this.model.valid) {
      this.model.markAllAsTouched();
      return;
    }

    this.productStore.updateActive(this.model.value as Partial<Product>);
    this.snackBar.open(`Product ${this.model.value.name} editeted succesfully`, 'OK', {
      panelClass: 'green-snackbar'
    });
    this.dialogRef.close();
  }
}
