import { Component, Input, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_Services/account.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private accounteService = inject(AccountService)
  model:any = {}
  usersFromHomeComponent = input.required<any>()
  cancelRegister=output<boolean>()
  register(){
    this.accounteService.register(this.model).subscribe({
      next : respose => {
        console.log(respose)
        this.cancel()
      },
      error: error => console.log(error)
      
    })

  }
  cancel(){
   this.cancelRegister.emit(false)
    
  }

}
