import { Component, inject } from '@angular/core';
import { ViewPanel } from "../../../directives/view-panel";
import { MatIcon } from '@angular/material/icon';
import { EcommerceStore } from '../../../ecommerce-store';
import { RouterLink } from "@angular/router";
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-tease-wishlist',
  imports: [ViewPanel, MatIcon, RouterLink, MatButton],
  templateUrl: './tease-wishlist.html',
  styles: ``,
})
export class TeaseWishlist {
  store = inject(EcommerceStore);
}
