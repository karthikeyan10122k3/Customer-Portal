import { CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';

export const childGuard: CanActivateChildFn = (childRoute, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.isAuthenticated().pipe(
    map((isAuth) => {
      if (!isAuth) {
        router.navigate(['/login']);
        return false;
      }
      return true;
    }),
    catchError((err) => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
