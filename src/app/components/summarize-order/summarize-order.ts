import { Component, computed, inject } from '@angular/core';
import { EcommerceStore } from '../../ecommerce-store';
import { ViewPanel } from "../../directives/view-panel";

@Component({
  selector: 'app-summarize-order',
  imports: [ViewPanel],
  templateUrl: './summarize-order.html',
  styles: ``,
})
export class SummarizeOrder {
  store = inject(EcommerceStore);

  subtotal = computed(() => Math.round(this.store.cartItems().reduce((acc, item) => acc + item.product.price * item.quantity, 0)));

  tax = computed(() => Math.round(this.subtotal() * 0.05));

  total = computed(() => this.subtotal() - this.tax());
}
