import { Component, OnInit, inject } from '@angular/core';
import { RegisterComponent } from "../register/register.component";
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [RegisterComponent]
})
export class HomeComponent implements OnInit {
  http = inject(HttpClient);

  registered = false  

  users:any;

  registerToggle(){
    this.registered = !this.registered
  }
  
  ngOnInit(): void {
    this.getusers()
  }
  getusers(){
    this.http.get('http://localhost:5000/api/users').subscribe({
      next:(response)=>{this.users = response ;
      },
      error:(error)=>{console.log(error);
      },
      complete:()=>{console.log("request is ok :)");
      }
     })

  }

  CancelRegister(event:boolean){
    this.registered = event
  }














  // getRandomSize(min: number, max: number): number {
  //   return Math.floor(Math.random() * (max - min + 1)) + min;
  // }

  // // This method will be called when the component is initialized
  // ngOnInit(): void {
  //   const elements = document.querySelectorAll('.dot');
  //   elements.forEach(element => {
  //     const randomWidth = this.getRandomSize(50, 200); // Change 50 and 200 to your desired min and max
  //     const randomHeight = this.getRandomSize(50, 200); // Change 50 and 200 to your desired min and max
  //     (element as HTMLElement).style.width = `${randomWidth}px`;
  //     (element as HTMLElement).style.height = `${randomHeight}px`;
  //   });
  // }
}
