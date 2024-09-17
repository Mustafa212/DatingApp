import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { User } from '../_models/user';
import { take } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubsUrl
  private toastr = inject(ToastrService)
  private router = inject(Router)
  private hubConnection? :HubConnection
  onlineUsers = signal<string[]>([]);

  createHubConnection(user:User){
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl+'presence',{
        accessTokenFactory:()=> user.token
      })
      .withAutomaticReconnect()
      .build()

    this.hubConnection.start().catch(error => console.log(error));
    this.hubConnection.on("UserIsOnline",username=>{
     this.onlineUsers.update(users => [...users , username])
    })

    this.hubConnection.on("UserIsOffline",username=>{
      this.onlineUsers.update(users => users.filter(x=> x !== username))
    })


    this.hubConnection.on("OnlineUsers",usernames=>{
      this.onlineUsers.set(usernames)
    })


    this.hubConnection.on("NewMessageReceived",({username , knownAs})=>{
      this.toastr.info(knownAs+' sent you a new message! click to show')
      .onTap
      .pipe(take(1))
      .subscribe(()=>this.router.navigateByUrl('/members/'+username+'?tab=messages'))
    })
    
  }

  stopHubConnection(){
    if(this.hubConnection?.state === HubConnectionState.Connected){
      this.hubConnection.stop().catch(error => console.log(error));
      
    }
  }


}
