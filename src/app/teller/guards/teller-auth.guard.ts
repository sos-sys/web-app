import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TellerService } from '../services/teller.service';

export const tellerAuthGuard: CanActivateFn = (route, state) => {
  const tellerService = inject(TellerService);
  const router = inject(Router);

  // Synchronously check if the user is authenticated
  if (tellerService.getAuthUser()) {
    return true; // Allow access
  } else {
    // Block access and redirect to the auth screen
    return router.parseUrl('/teller/auth');
  }
};
