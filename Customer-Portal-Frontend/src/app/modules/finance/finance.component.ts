import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-finance',
  imports: [RouterOutlet, RouterLink, MatIcon],
templateUrl: './finance.component.html',
  styleUrl: './finance.component.css'
})
export class FinanceComponent {

}
