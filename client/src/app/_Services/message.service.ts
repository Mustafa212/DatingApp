import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginatedResult } from '../_models/Pagination';
import { Message } from '../_models/message';
import {
  setPaginationHeaders,
  setPaginationResponse,
} from './PaginationHelpers';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';
import { User } from '../_models/user';
import { HighlightedMessage } from '../_models/MessageHighlighted';
import { Group } from '../_models/group';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  baseUrl = environment.apiUrl;
  hubUrl = environment.hubsUrl;
  private http = inject(HttpClient);
  hubConnection?: HubConnection;
  paginatedResult = signal<PaginatedResult<Message[]> | null>(null);
  uniqueUsers = signal<Message[] | undefined>(undefined);
  numberofmessages = signal<number | undefined>(0);
  messageThread = signal<Message[]>([]);
  messagHighlited = signal<HighlightedMessage[]>([]);
  
  currentUserSelectedName = signal<string>('')
  currentUserSelected = signal<Message|null>(null)


  createHubConnection(user: User, otherusername: string) {
    
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?user=' + otherusername, {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch((error) => console.log(error));

    this.hubConnection.on('RecievedMessageThread', (messages) => {      
      this.messageThread.set(messages);
      let arr: HighlightedMessage[] = [];
      messages.result.forEach((x: Message) => {
        let high = false;
        arr.push({ message: x, highlighted: high });
      });
      this.messagHighlited.set(arr);
    });


    this.hubConnection.on("NewMessage",messagee=>{
      let x = {message:messagee , highlighted: false}
      this.messagHighlited.update(messages=> [...messages,x])
    })

    
    this.hubConnection.on("UpdatedGroup",(group:Group)=>{

      if (group.connections.some(x => x.username === otherusername)) {
        this.messagHighlited.update(messages => {
          messages.forEach(mes =>{
            if (!mes.message.dateRead) 
            {
              mes.message.dateRead = new Date(Date.now()) 
            }
          })
          return messages;
        })
      }
    })
  }

  stopHubConnection() {
    
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop().catch((error) => console.log(error));
    }


  }

  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = setPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);

    return this.http
      .get<Message[]>(this.baseUrl + 'messages', {
        observe: 'response',
        params,
      })
      .subscribe({
        next: (resp) => {
          setPaginationResponse(resp, this.paginatedResult);

          let x;
          switch (container) {
            case 'Inbox':
              x = this.paginatedResult()?.items?.filter(
                (item, index, self) =>
                  index === self.findIndex((t) => t.senderId === item.senderId)
              );
              this.uniqueUsers.set(x);
              break;
            case 'Outbox':
              x = this.paginatedResult()?.items?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex((t) => t.recipientId === item.recipientId)
              );
              this.uniqueUsers.set(x);
              break;
            default:
              x = this.paginatedResult()?.items?.filter(
                (item, index, self) =>
                  index === self.findIndex((t) => t.senderId === item.senderId)
              );
              x = x?.filter((y) => !y.dateRead);
              this.numberofmessages.set(x!.length);
              this.uniqueUsers.set(x);
              break;
          }
        },
      });
  }

  getMessageThread(username: string) {
    return this.http.get<Message[]>(
      this.baseUrl + 'messages/thread/' + username
    );
  }

  async sendMessage(username: string, content: string) {

    
    return this.hubConnection?.invoke('SendMessage',{
      RecipientUsername: username,
      content,
    })
    // return this.http.post<Message>(this.baseUrl + 'messages', {
    //   RecipientUsername: username,
    //   content,
    // });
  }

  deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + 'messages/' + id);
  }
}
