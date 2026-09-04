import { Component, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-back-button',
  imports: [MatButton, MatIcon, RouterLink],
  templateUrl: './back-button.html',
  styles: `
  :host {
    display: block;
  }`,
})
export class BackButton {
  navigateTo = input<string>();
}
