import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_models/Members';
import { of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembersService {


  private http = inject(HttpClient)
  baseurl = environment.apiUrl;
  members = signal<Member[]>([]);

  getMembers(){
    return this.http.get<Member[]>(this.baseurl+"users").subscribe({
      next:mem => this.members.set(mem)
    })

    
  }
  getMember(username:string){

    const member = this.members().find(x=>x.username === username)
    if (member !== undefined) {
      return of(member)
    }
    return this.http.get<Member>(this.baseurl+"users/"+username)

    
  }

  updateMember(member:Member){

    return this.http.put<Member>(this.baseurl+"users" , member).pipe(
      tap(()=>{
        this.members.update(members => members.map(
          m=> m.username === member.username  ? member : m
        ))
      })
    )

  }


}
