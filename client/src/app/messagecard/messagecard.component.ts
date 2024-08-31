import { Component, input, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { TimeagoModule } from 'ngx-timeago';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-messagecard',
  standalone: true,
  imports: [TimeagoModule , NgClass],
  templateUrl: './messagecard.component.html',
  styleUrl: './messagecard.component.css'
})
export class MessagecardComponent  implements OnInit{
  
  message = input<Message>()
  container = input<string>()
  
  username = input<string>()

  isOutbox!:boolean ;
  ngOnInit(): void {
    this.isOutbox =  this.container() === 'Outbox';
  }

}
