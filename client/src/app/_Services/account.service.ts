import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { map } from 'rxjs';
import { User } from '../_models/user';
import { environment } from '../../environments/environment';
import { MembersService } from './members.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  //private memberService = inject(MembersService);
  baseurl = environment.apiUrl;
  currentuser = signal<User|null>(null)
  login(model:any){
    return this.http.post<User>(this.baseurl+"account/login" , model).pipe(
      map(
        user=>{
          if (user)this.setCurrentUser(user)
                    
        }
      )
    );
  }

  register(model:any){
    return this.http.post<User>(this.baseurl+"account/register" , model).pipe(
      map(
        user=>{
          if (user)this.setCurrentUser(user)
          
          return user
        }

        
      )

    );
  }

  setCurrentUser(user:User){
    localStorage.setItem("user" , JSON.stringify(user));
    this.currentuser.set(user);

  }

  logout(){
    localStorage.removeItem("user");
    // this.memberService.paginatedResult.set(null);
    this.currentuser.set(null);
  }
}
