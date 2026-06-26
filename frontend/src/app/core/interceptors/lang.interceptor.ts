import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LanguageService } from '../services/language.service';

export const langInterceptor: HttpInterceptorFn = (req, next) => {
  const langService = inject(LanguageService);
  const activeLang = langService.getCurrentLanguage();

  // Clone request and add Accept-Language header
  const modifiedReq = req.clone({
    headers: req.headers.set('Accept-Language', activeLang)
  });

  return next(modifiedReq);
};
