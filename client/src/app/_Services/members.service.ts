import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_models/Members';
import { of, tap } from 'rxjs';
import { Photo } from '../_models/Photo';

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


  setMainPhoto(photo:Photo){
    return this.http.put(this.baseurl+'users/set-main-photo/'+photo.id ,{}).pipe(
      tap(()=>{
        this.members.update(mem => mem.map(m=>{
          if (m.photos.includes(photo)) {
            m.photoUrl = photo.url
            
          }
          return m;
        }))
      })
    )
  }
  deletePhoto(photo:Photo){
    return this.http.delete(this.baseurl+'users/delete-photo/'+photo.id ).pipe(
      tap(()=>{
        this.members.update(mem => mem.map(m=>{
          if (m.photos.includes(photo)) {
            m.photos = m.photos.filter(x=>x.id!== photo.id)
            
          }
          return m;
        }))
      })
    )
  }

}
