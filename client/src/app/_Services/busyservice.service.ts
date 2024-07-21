import { inject, Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyserviceService {

  busyServiceCount = 0;
  private spinner = inject(NgxSpinnerService)

  busy(){
    this.busyServiceCount++;
    this.spinner.show(undefined , {
     
    })
  }
  idle(){
    this.busyServiceCount--;
    if (this.busyServiceCount <=0) {
      this.busyServiceCount = 0
      this.spinner.hide()

    }

  }

}
