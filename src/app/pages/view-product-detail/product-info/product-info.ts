import { Component, inject, input, signal } from '@angular/core';
import { Product } from '../../../models/product';
import { TitleCasePipe } from '@angular/common';
import { StockStatus } from '../stock-status/stock-status';
import { QtySelector } from "../../../components/qty-selector/qty-selector";
import { ToggleWishListButton } from "../../../components/toggle-wish-list-button/toggle-wish-list-button";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatIcon } from '@angular/material/icon';
import { EcommerceStore } from '../../../ecommerce-store';

@Component({
  selector: 'app-product-info',
  imports: [TitleCasePipe, StockStatus, QtySelector, ToggleWishListButton, MatIconButton, MatIcon, MatButton],
  templateUrl: './product-info.html',
  styles: ``,
})
export class ProductInfo {
  product = input.required<Product>();
  quantity = signal(1);

  store = inject(EcommerceStore);
}
