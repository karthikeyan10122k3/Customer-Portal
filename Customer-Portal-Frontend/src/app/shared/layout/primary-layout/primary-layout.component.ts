import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UserService } from '../../../core/services/user/user.service';


@Component({
  selector: 'app-primary-layout',
  imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkActive,
      MatToolbarModule,
      MatIconModule,
      MatTooltipModule,
  ],
  templateUrl: './primary-layout.component.html',
  styleUrl: './primary-layout.component.css'
})
export class PrimaryLayoutComponent {
  customerName: string = '';

  private authService = inject(AuthService);
  private userService = inject(UserService)

  constructor(){
    this.userService.getUserName().subscribe(result=>{
      this.customerName = result
    });
  }

  logout(): void {
    this.authService.logout();
  }

}
