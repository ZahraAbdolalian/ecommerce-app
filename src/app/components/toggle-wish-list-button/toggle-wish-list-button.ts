import { Component, computed, inject, input } from '@angular/core';
import { EcommerceStore } from '../../ecommerce-store';
import { Product } from '../../models/product';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-toggle-wish-list-button',
  imports: [MatIconButton, MatIcon],
  templateUrl: './toggle-wish-list-button.html',
  styles: ``,
})
export class ToggleWishListButton {
  store = inject(EcommerceStore);

  product = input.required<Product>();

  isInWishlist = computed(() => this.store.wishListItems().find(p => p.id === this.product().id));

  toggleWhisList(product: Product) {
    if (this.isInWishlist()) {
      this.store.removeFromWhishList(product);
    } else {
      this.store.addToWhishList(product);
    }
  }
}
