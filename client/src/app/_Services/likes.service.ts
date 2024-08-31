import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Member } from '../_models/Members';
import { setPaginationHeaders, setPaginationResponse } from './PaginationHelpers';
import { PaginatedResult } from '../_models/Pagination';

@Injectable({
  providedIn: 'root'
})
export class LikesService {
  baseUrl = environment.apiUrl
  private http = inject(HttpClient)
  likedIds = signal<number[]>([])
 paginatedResult = signal<PaginatedResult<Member[]> | null>(null)
  toggleLike(targetId: number){
    return this.http.post(`${this.baseUrl}likes/${targetId}`,{})
  }

  getLikes(predicate:string , pageNumber:number,pageSize:number){
    let params = setPaginationHeaders(pageNumber,pageSize)
    params = params.append('predicate' , predicate)
    return this.http.get<Member[]>(`${this.baseUrl}likes`,{observe:'response' , params}).subscribe({
      next: resp => setPaginationResponse(resp,this.paginatedResult)
    })
  }

  getLikeIds(){
    return this.http.get<number[]>(`${this.baseUrl}likes/list`).subscribe({
      next:ids=> this.likedIds.set(ids)
    })
  }

}
