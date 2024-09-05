import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../_Services/account.service';
import { ToastrService } from 'ngx-toastr';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService)
  const toastr = inject(ToastrService)

  if(accountService.roles().includes('Admin') ||accountService.roles().includes('Moderator') ){
    return true
  }
  else{
    toastr.error("you Cannot Enter")
    return false
  }

};
