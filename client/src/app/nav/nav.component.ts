import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_Services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule,BsDropdownModule , RouterLink , RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  private router = inject(Router)
  private toast = inject(ToastrService)
  accountservice = inject(AccountService);

  
  model:any = {}

  login(){
    this.accountservice.login(this.model).subscribe({
      next: _ =>{
          this.router.navigateByUrl("/members")
  
      },
      error: error => this.toast.error(error.error)
      

      
    })
    
  }
  logout(){
    this.accountservice.logout()
    this.router.navigateByUrl("/")
  }

}
