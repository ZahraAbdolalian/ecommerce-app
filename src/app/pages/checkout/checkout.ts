import { Component, inject } from '@angular/core';
import { BackButton } from "../../components/back-button/back-button";
import { PaymentForm } from './payment-form/payment-form';
import { ShippingForm } from './shipping-form/shipping-form';
import { SummarizeOrder } from "../../components/summarize-order/summarize-order";
import { EcommerceStore } from '../../ecommerce-store';

@Component({
  selector: 'app-checkout',
  imports: [BackButton, ShippingForm, PaymentForm, SummarizeOrder],
  templateUrl: './checkout.html',
  styles: ``,
})
export default class Checkout {
  store = inject(EcommerceStore);
}
