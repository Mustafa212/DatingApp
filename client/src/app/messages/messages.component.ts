import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, output, signal, ViewChild } from '@angular/core';
import { MessageService } from '../_Services/message.service';
import { AccountService } from '../_Services/account.service';
import { MessagecardComponent } from "../messagecard/messagecard.component";
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';
import { Message } from '../_models/message';
import { MemberMessagesComponent } from "../members/member-messages/member-messages.component";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [MessagecardComponent, ButtonsModule, FormsModule, MemberMessagesComponent , NgIf],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',

})
export class MessagesComponent implements OnInit  {
  messageservice = inject(MessageService);
  accountService = inject(AccountService)
  pageNumber =1
  pageSize =5
  container = 'Inbox'

  isInbox =  this.container === 'Inbox';

  showblur = signal<boolean>(false)



  private cdr = inject(ChangeDetectorRef);

  currentUserSelectedName = signal<string>('mostafa')
  currentUserSelected = signal<Message|null>(null)

  ngOnInit() {
    this.loadMessages()
    

  }
  loadMessages(){
    this.messageservice.getMessages(this.pageNumber , this.pageSize , this.container)
  }

  pageChanged(event:any){
    if(this.pageNumber != event.page){
      this.pageNumber = event.page
      this.loadMessages()
    }
  }


  emitUsername(item:Message){
    if(this.container === 'Inbox'){
      this.currentUserSelectedName.set(item.senderUsername)

    }
    else{
      this.currentUserSelectedName.set(item.recipientUsername)

    }
    this.currentUserSelected.set(item)
    this.cdr.detectChanges()
    
  }

  toggleBlur(event:any){
    console.log("in toggle blur");
    
    
    this.showblur.set(event)
    this.cdr.detectChanges()
    console.log(this.showblur);
  }
 
}
