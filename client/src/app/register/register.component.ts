import { Component, Input, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_Services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private accounteService = inject(AccountService)
  private toast = inject(ToastrService)
  model:any = {}
  usersFromHomeComponent = input.required<any>()
  cancelRegister=output<boolean>()
  register(){
    this.accounteService.register(this.model).subscribe({
      next : respose => {
        console.log(respose)
        this.cancel()
      },
      error: error => this.toast.error(error.error)
      
    })

  }
  cancel(){
   this.cancelRegister.emit(false)
    
  }

}
