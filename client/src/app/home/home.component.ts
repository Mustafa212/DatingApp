import { Component, OnInit, inject } from '@angular/core';
import { RegisterComponent } from "../register/register.component";
import { HttpClient } from '@angular/common/http';
import Aos from 'aos'
@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [RegisterComponent]
})
export class HomeComponent implements OnInit  {
  ngOnInit(): void {
      Aos.init();
  }
  registered = false  
  registerToggle(){
    this.registered = !this.registered
  }
  
  CancelRegister(event:boolean){
    this.registered = event
  }

}
