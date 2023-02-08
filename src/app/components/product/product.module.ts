import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ProductComponent } from './product.component';
import { SharedModule } from 'src/app/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: ProductComponent
  }
];

@NgModule({
  declarations: [
    ProductComponent,
    EditProductComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class ProductModule { }
