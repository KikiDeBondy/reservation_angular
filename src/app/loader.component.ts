import { Component, Input } from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-loader',
  template: `
    <div class="fixed inset-0 flex items-center justify-center z-50" *ngIf="loading">
      <div class="flex flex-col items-center">
        <img src="assets/scissors.svg" alt="Ciseaux" class="w-20 h-20 animate-bounce"/>
        <p class="mt-4 text-lg font-semibold text-gray-600">Chargement...</p>
      </div>
    </div>
  `,
  imports: [
    NgIf
  ],
  styles: [`
    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    img {
      animation: spin 2s linear infinite;
    }
  `]
})
export class LoaderComponent {
  @Input() loading: boolean = false;
}
