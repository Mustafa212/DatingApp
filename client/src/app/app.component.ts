import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from "./nav/nav.component";
import { AccountService } from './_Services/account.service';
import { HomeComponent } from "./home/home.component";
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, NavComponent, HomeComponent,NgxSpinnerComponent]
})
export class AppComponent implements OnInit {
 
  private accountservice = inject(AccountService)
  ngOnInit(): void {
    this.setCurrentUser()

   
  }
  setCurrentUser(){
    const userstring = localStorage.getItem("user")
    if(!userstring) return
    const user = JSON.parse(userstring)
    this.accountservice.currentuser.set(user)
    
   
  }

  
}
