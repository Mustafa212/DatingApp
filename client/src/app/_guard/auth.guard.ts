import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../_Services/account.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const accounteService = inject(AccountService)
  const toast = inject(ToastrService)
  const router = inject(Router)
 if(accounteService.currentuser()){
  return true
 }
 else{
   toast.error("what the fk are you doing")
   return false
 }
};
