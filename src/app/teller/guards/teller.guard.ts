import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { TellerService } from '../services/teller.service';

export const tellerGuard: CanActivateChildFn = (childRoute, state) => {
  const tellerService = inject(TellerService);
  const router = inject(Router);

  // Synchronously check if there is an active session
  const session = tellerService.getSession();

  if (session) {
    return true; // Allow access
  } else {
    // Block access and redirect to the open session screen
    return router.parseUrl('/teller/open');
  }
};
