import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { map } from 'rxjs';
import { User } from '../_models/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  baseurl = environment.apiUrl;
  currentuser = signal<User|null>(null)
  login(model:any){
    return this.http.post<User>(this.baseurl+"account/login" , model).pipe(
      map(
        user=>{
          localStorage.setItem("user" , JSON.stringify(user));
          this.currentuser.set(user);
        }
      )

    );
  }

  register(model:any){
    return this.http.post<User>(this.baseurl+"account/register" , model).pipe(
      map(
        user=>{
          localStorage.setItem("user" , JSON.stringify(user));
          this.currentuser.set(user);


          return user
        }

        
      )

    );
  }

  logout(){
    localStorage.removeItem("user" );
    this.currentuser.set(null);
  }
}
