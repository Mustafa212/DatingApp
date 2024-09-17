import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { map } from 'rxjs';
import { User } from '../_models/user';
import { environment } from '../../environments/environment';
import { LikesService } from './likes.service';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  baseurl = environment.apiUrl;
  private likeService = inject(LikesService)
  private presenceService = inject(PresenceService)
  currentuser = signal<User|null>(null)
  roles = computed(()=>{
    const user = this.currentuser()
    if (user && user.token) {
      const role = JSON.parse(atob(user.token.split('.')[1])).role
      return Array.isArray(role)  ? role : [role]
    } 
    return []
  })



  login(model:any){
    return this.http.post<User>(this.baseurl+"account/login" , model).pipe(
      map(
        user=>{
          console.log(user.gender);
          
          if(user) this.setCurrentUser(user)
          return user  
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
    this.currentuser.set(user);
    localStorage.setItem("user" , JSON.stringify(user));
    this.likeService.getLikeIds()
    this.presenceService.createHubConnection(user)


  }

  logout(){
    localStorage.removeItem("user");
    // this.memberService.paginatedResult.set(null);
    this.currentuser.set(null);
    this.presenceService.stopHubConnection()
  }
}
