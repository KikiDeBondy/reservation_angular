import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthentificationService} from "../../../Services/auth/authentification.service";

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthentificationService);
  const router = inject(Router);
  if(!auth.isAdmin()) {
    router.navigate(['/']);
    return false;
  }
  return true;};
