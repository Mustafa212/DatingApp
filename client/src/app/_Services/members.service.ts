import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_models/Members';
import { map, of, tap } from 'rxjs';
import { Photo } from '../_models/Photo';
import { PaginatedResult } from '../_models/Pagination';
import { UserParams } from '../_models/UserParams';
import { AccountService } from './account.service';
import { setPaginationResponse, setPaginationHeaders } from './PaginationHelpers';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private http = inject(HttpClient);
  private accountservice = inject(AccountService)
  baseurl = environment.apiUrl;
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null);
  memberCache = new Map();

  
 
  user = this.accountservice.currentuser()

  userParams = signal<UserParams>(new UserParams(this.user))




  resetUserParams(){    
    this.userParams.set(new UserParams(this.user))
  }

  getMembers() {
    if(this.user !== this.accountservice.currentuser()){
      this.user = this.accountservice.currentuser()
      this.userParams.set(new UserParams(this.accountservice.currentuser()))

    }

    
    let response  =  this.memberCache.get(Object.values(this.userParams()).join('-'))    
    if (response) {
      return setPaginationResponse(response , this.paginatedResult)
    }


    let params = setPaginationHeaders(this.userParams().pageNumber , this.userParams().pageSize)


    params = params.append('minAge' , this.userParams().minAge)
    params = params.append('maxAge' , this.userParams().maxAge)     
    params = params.append('gender' , this.userParams().gender)
    params = params.append('orderBy' , this.userParams().orderBy)

    
    return this.http
      .get<Member[]>(this.baseurl + 'users', { observe: 'response', params })
      .subscribe({
        next: (response) => {
         setPaginationResponse(response, this.paginatedResult)
         this.memberCache.set(Object.values(this.userParams()).join('-') , response)
        },
      });
  }





  getMember(username: string) {
    const member:Member = [...this.memberCache.values()].reduce(
      (arr , elem)=> arr.concat(elem.body) , []
    )
    .find(
      (m:Member) => m.username == username
    )

    if(member) return of(member)

    return this.http.get<Member>(this.baseurl + 'users/' + username);
  }

  updateMember(member: Member) {
    return this.http
      .put<Member>(this.baseurl + 'users', member)
      .pipe
      // tap(()=>{
      //   this.members.update(members => members.map(
      //     m=> m.username === member.username  ? member : m
      //   ))
      // })
      ();
  }

  setMainPhoto(photo: Photo) {
    return this.http
      .put(this.baseurl + 'users/set-main-photo/' + photo.id, {})
      .pipe
      // tap(()=>{
      //   this.members.update(mem => mem.map(m=>{
      //     if (m.photos.includes(photo)) {
      //       m.photoUrl = photo.url

      //     }
      //     return m;
      //   }))
      // })
      ();
  }
  deletePhoto(photo: Photo) {
    return this.http
      .delete(this.baseurl + 'users/delete-photo/' + photo.id)
      .pipe
      // tap(()=>{
      //   this.members.update(mem => mem.map(m=>{
      //     if (m.photos.includes(photo)) {
      //       m.photos = m.photos.filter(x=>x.id!== photo.id)

      //     }
      //     return m;
      //   }))
      // })
      ();
  }
}
