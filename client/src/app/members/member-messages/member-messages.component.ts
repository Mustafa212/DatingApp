import {
  Component,
  inject,
  input,
  OnChanges,
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
import { NgClass, NgIf } from '@angular/common';
import { HighlightedMessage } from '../../_models/MessageHighlighted';
@Component({
  selector: 'app-member-messages',
  standalone: true,
  imports: [TimeagoModule, FormsModule, NgIf, NgClass],
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css',
})
export class MemberMessagesComponent implements OnInit, OnChanges {
  @ViewChild('messageForm') messageForm?: NgForm;
  showBackdrop = output<boolean>();
  showBlur = input<boolean>();
  messageService = inject(MessageService);
  accountService = inject(AccountService);
  username = input.required<string>();
  Messages: Message[] = [];

  messageContent = '';
  messagHighlited: HighlightedMessage[] = [];

  selectedItem = signal<HighlightedMessage|null>(null)

  ngOnInit(): void {
    this.loadMessages();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['username']) {
      this.loadMessages();
    }
  }

  loadMessages() {
    this.messageService.getMessageThread(this.username()!).subscribe({
      next: (message) => {
        this.messagHighlited = [];
        this.Messages = message;

        this.Messages.forEach((x) => {
          let high = false;
          this.messagHighlited.push({ message: x, highlighted: high });
        });
      },
    });
  }
  sendMsdg() {
    console.log('here');
    this.messageService
      .sendMessage(this.username(), this.messageContent)
      .subscribe({
        next: (msg) => {
          this.Messages.push(msg);
          let high = false;
          this.messagHighlited.push({ message: msg, highlighted: high });

          this.messageForm?.reset();
        },
      });
  }

  toggleHighlight(message: any) {
    const item = this.messagHighlited.find((x) => x.message.id == message.id);
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
        this.messagHighlited.splice(this.messagHighlited.findIndex(m=> m.message.id === id) , 1)

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
