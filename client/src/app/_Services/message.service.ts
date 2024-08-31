import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginatedResult } from '../_models/Pagination';
import { Message } from '../_models/message';
import { setPaginationHeaders, setPaginationResponse } from './PaginationHelpers';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl
  private http = inject(HttpClient)
  paginatedResult = signal<PaginatedResult<Message[]>|null>(null)
  uniqueUsers = signal< Message[] | undefined>(undefined) 
  numberofmessages =signal<number|undefined>(0)

  getMessages(pageNumber:number , pageSize:number , container:string){

    let params = setPaginationHeaders(pageNumber, pageSize)
    params = params.append('Container', container)

    return this.http.get<Message[]>(this.baseUrl+'messages',{observe:'response' , params}).subscribe({
      next: resp => {
        setPaginationResponse(resp , this.paginatedResult)


        let x
        switch(container){
          case 'Inbox':
            x = this.paginatedResult()?.items?.filter((item, index, self) => 
              index === self.findIndex((t) => t.senderId === item.senderId)
            );
            this.uniqueUsers.set(x)
            break;
          case 'Outbox':
            x = this.paginatedResult()?.items?.filter((item, index, self) => 
              index === self.findIndex((t) => t.recipientId === item.recipientId)
            );
            this.uniqueUsers.set(x)
            break;
          default:
            x = this.paginatedResult()?.items?.filter((item, index, self) => 
              index === self.findIndex((t) => t.senderId === item.senderId)
            );
            x=x?.filter(y=> !y.dateRead)
            this.numberofmessages.set(x!.length)
            this.uniqueUsers.set(x)
          break;
     
        }


    
      }
    })

  }

  getMessageThread(username:string){
    return this.http.get<Message[]>(this.baseUrl+'messages/thread/'+username)
  }

  sendMessage(username:string , content :string){
    return this.http.post<Message>(this.baseUrl+'messages' ,{
      RecipientUsername :username , 
      content
    })
  }

  deleteMessage(id:number){
    return this.http.delete(this.baseUrl + 'messages/'+id);
  }

}
