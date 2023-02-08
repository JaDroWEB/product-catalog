import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

// Components
import { AppComponent } from './app.component';
import { MenuItemsComponent } from './components/main-page/menu-items/menu-items.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { environment } from 'src/environments/environment';
import { SharedModule } from './shared.module';
import { ProductItemsComponent } from './components/main-page/product-items/product-items.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuItemsComponent,
    MainPageComponent,
    ProductItemsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
