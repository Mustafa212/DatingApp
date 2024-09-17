import {
  Component,
  inject,
  input,
  OnChanges,
  OnDestroy,
  OnInit,
  output,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MessageService } from '../../_Services/message.service';
import { Message } from '../../_models/message';
import { TimeagoModule } from 'ngx-timeago';
import { AccountService } from '../../_Services/account.service';
import { FormsModule, NgForm } from '@angular/forms';
import { NgClass, NgIf, NgStyle } from '@angular/common';
import { HighlightedMessage } from '../../_models/MessageHighlighted';
import { MembersService } from '../../_Services/members.service';
@Component({
  selector: 'app-member-messages',
  standalone: true,
  imports: [TimeagoModule, FormsModule, NgIf, NgClass , NgStyle],
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css',
})
export class MemberMessagesComponent implements OnInit , OnDestroy , OnChanges {
  @ViewChild('messageForm') messageForm?: NgForm;
  showBackdrop = output<boolean>();
  showBlur = input<boolean>();
  messageService = inject(MessageService);
  accountService = inject(AccountService);
  Messages: Message[] = [];
  username = input<string>()
  messageContent = '';
  // messagHighlited: HighlightedMessage[] = [];

  selectedItem = signal<HighlightedMessage|null>(null)

  ngOnInit(): void {
    
    
   this.loadMessages()
    
  }
  ngOnChanges(changes: SimpleChanges) {  
    console.log("here");
    if (changes['username']) {
      this.messageService.stopHubConnection()
      this.loadMessages()
    }
  }
  ngOnDestroy(): void {
      this.messageService.stopHubConnection()
  }

  loadMessages() {  
    
    var user = this.accountService.currentuser()
    if (user && this.username() !== null) {
      this.messageService.createHubConnection(user ,this.username()!)
    }
  }


  sendMsdg() {
      
    this.messageService
      .sendMessage(this.username()!, this.messageContent)
      .then(()=>{

        this.messageForm?.reset()
      })
      // .subscribe({
      //   next: (msg) => {
      //     this.Messages.push(msg);
      //     let high = false;
      //     this.messageService.messagHighlited().push({ message: msg, highlighted: high });

      //     this.messageForm?.reset();
      //   },
      // });
  }

  toggleHighlight(message: any) {
    const item = this.messageService.messagHighlited().find((x) => x.message.id == message.id);
    if (item) {
      this.selectedItem.set(item)
      item.highlighted = !item.highlighted;
      this.showBackdrop.emit(item.highlighted);
    }
  }

  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe({
      next:_=>{
        this.toggleHighlight(this.selectedItem()?.message)
        this.messageService.messagHighlited().splice(this.messageService.messagHighlited().findIndex(m=> m.message.id === id) , 1)

        this.messageService.paginatedResult.update(
          prev=>{
            if (prev && prev.items) {
              prev.items.splice(prev.items.findIndex(m=> m.id === id ) , 1)
              return prev
            }
            return prev
          }
        )
      }
    })
  }
}
