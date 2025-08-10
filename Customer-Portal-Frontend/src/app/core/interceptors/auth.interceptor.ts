import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { LoaderService } from '../services/extras/loader/loader.service';
import { finalize } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);

  loaderService.show();

  const authReq = req.clone({
    withCredentials: true
  });

  return next(authReq).pipe(
    finalize(() => loaderService.hide())
  );
};
