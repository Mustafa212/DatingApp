import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BusyserviceService } from '../_Services/busyservice.service';
import { delay, finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {

  const busyservice = inject(BusyserviceService)

  busyservice.busy()
  return next(req).pipe(
    delay(1000),
    finalize(()=>{
      busyservice.idle()
    })
  );
};
