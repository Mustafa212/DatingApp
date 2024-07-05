import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-test-errors',
  standalone: true,
  imports: [],
  templateUrl: './test-errors.component.html',
  styleUrl: './test-errors.component.css'
})
export class TestErrorsComponent {
  baseurl = "http://localhost:5000/api/";
  private http = inject(HttpClient);
  validationerrors:string[] = []
  get400Error(){
    this.http.get(this.baseurl+"buggy/bad-request").subscribe({
      next:res => console.log(res),
      error:e=>console.log(e)
      
      
    })
  }
  get401Error(){
    this.http.get(this.baseurl+"buggy/auth").subscribe({
      next:res => console.log(res),
      error:e=>console.log(e)
      
      
    })
  }
  get404Error(){
    this.http.get(this.baseurl+"buggy/not-found").subscribe({
      next:res => console.log(res),
      error:e=>console.log(e)
      
      
    })
  }
  get500Error(){
    this.http.get(this.baseurl+"buggy/server-error").subscribe({
      next:res => console.log(res),
      error:e=>console.log(e)
      
      
    })
  }
  get400validationError(){
    this.http.post(this.baseurl+"account/register",{}).subscribe({
      next:res => console.log(res),
      error:e=>{
        console.log(e)
        this.validationerrors = e
      }
      
      
    })
  }



}
