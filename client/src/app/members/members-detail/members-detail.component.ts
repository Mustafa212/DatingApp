import { ChangeDetectorRef, Component, inject, OnInit, signal, ViewChild, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from '../../_models/Members';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { DatePipe, NgIf } from '@angular/common';
import { MemberMessagesComponent } from '../member-messages/member-messages.component';
import { PresenceService } from '../../_Services/presence.service';
import { AccountService } from '../../_Services/account.service';
import { MessageService } from '../../_Services/message.service';
import { HubConnectionState } from '@microsoft/signalr';
@Component({
  selector: 'app-members-detail',
  standalone: true,
  imports: [
    TabsModule,
    GalleryModule,
    TimeagoModule,
    DatePipe,
    MemberMessagesComponent,
    NgIf
  ],
  templateUrl: './members-detail.component.html',
  styleUrl: './members-detail.component.css',
})
export class MembersDetailComponent implements OnInit {
  @ViewChild('memberTabs' , {static:true}) memberTabs?: TabsetComponent;
  presenceService = inject(PresenceService);
  private router = inject(ActivatedRoute);
  private routt = inject(Router)
  accountservice = inject(AccountService)
  messageService = inject(MessageService)
  member: Member = {} as Member;
  images: GalleryItem[] = [];
  activetab?: TabDirective;
  showblur = signal<boolean>(false)
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.router.data.subscribe({
      next: (data) => {
        this.member = data['member'];
        this.member &&
          this.member.photos.map((p) => {
            this.images.push(new ImageItem({ src: p.url, thumb: p.url }));
          });
      },
    });

    this.router.paramMap.subscribe({
      next: _ => this.onRouteParamsChange()
    });


    this.router.queryParams.subscribe({
      next: (params) => {
        params['tab'] && this.selectTab(params['tab']);
      },
    });
  }
  onTabActivated(data :TabDirective){
    this.activetab = data
    this.routt.navigate([],{
      relativeTo:this.router,
      queryParams:{tab: this.activetab.heading},
      queryParamsHandling:'merge'
    })
    // if (this.activetab.heading === 'messages'  && this.member) {

    // }
  }

  onRouteParamsChange(){
    const user  = this.accountservice.currentuser()
    if (!user) {
      return
    }
    if (this.messageService.hubConnection?.state === HubConnectionState.Connected && this.activetab?.heading === 'messages') {
      this.messageService.hubConnection.stop().then(()=>{
        this.messageService.createHubConnection(user , this.member.username);
      })
      
    }
  }

  selectTab(heading: string) {
    if (this.memberTabs) {
      const messageTab = this.memberTabs.tabs.find((x) => x.heading == heading);
      if (messageTab) {
        messageTab.active = true;
      }
    }
  }

  
  toggleBlur(event:any){
    
    
    this.showblur.set(event)
    this.cdr.detectChanges()
    console.log(this.showblur);
  }

}
