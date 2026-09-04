import { Component, inject, input, signal } from '@angular/core';
import { ProductCard } from '../../components/product-card/product-card';
import { MatNavList, MatListItemTitle, MatListItem } from '@angular/material/list';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { EcommerceStore } from '../../ecommerce-store';
import { ToggleWishListButton } from "../../components/toggle-wish-list-button/toggle-wish-list-button";

@Component({
  selector: 'app-products-grid',
  imports: [ProductCard, MatSidenavContainer, MatSidenav, MatSidenavContent, MatNavList, MatListItemTitle, MatListItem, RouterLink,
    TitleCasePipe, ToggleWishListButton, ToggleWishListButton],
  templateUrl: './products-grid.html',
  styles: ``,
})
export default class ProductsGrid {
  category = input<string>('all');

  store = inject(EcommerceStore);

  categories = signal<string[]>(['all', 'electronics', 'clothing', 'accessories', 'home']);

  constructor() {
    this.store.setCategory(this.category);
  }
}
