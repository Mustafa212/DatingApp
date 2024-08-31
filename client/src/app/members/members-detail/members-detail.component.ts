import { Component, inject, OnInit, ViewChild, viewChild } from '@angular/core';
import { MembersService } from '../../_Services/members.service';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../_models/Members';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { DatePipe } from '@angular/common';
import { MemberMessagesComponent } from '../member-messages/member-messages.component';
@Component({
  selector: 'app-members-detail',
  standalone: true,
  imports: [
    TabsModule,
    GalleryModule,
    TimeagoModule,
    DatePipe,
    MemberMessagesComponent,
  ],
  templateUrl: './members-detail.component.html',
  styleUrl: './members-detail.component.css',
})
export class MembersDetailComponent implements OnInit {
  @ViewChild('memberTabs' , {static:true}) memberTabs?: TabsetComponent;
  private membersService = inject(MembersService);
  private router = inject(ActivatedRoute);

  member: Member = {} as Member;
  images: GalleryItem[] = [];
  activetab?: TabDirective;

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

    this.router.queryParams.subscribe({
      next: (params) => {
        params['tab'] && this.selectTab(params['tab']);
      },
    });
  }
  // onTabActivated(data :TabDirective){
  //   this.activetab = data
  //   if (this.activetab === 'messages'  &&) {

  //   }
  // }

  selectTab(heading: string) {
    if (this.memberTabs) {
      console.log('here');

      const messageTab = this.memberTabs.tabs.find((x) => x.heading == heading);
      if (messageTab) {
        messageTab.active = true;
      }
    }
  }
  // loadmember(){
  //   const username =  this.router.snapshot.paramMap.get("username")
  //   if (!username) {
  //     return
  //   }

  //   this.membersService.getMember(username).subscribe({
  //     next:member => {
  //       this.member=member
  //       member.photos.map((p)=>{
  //         this.images.push(new ImageItem({src:p.url , thumb:p.url}))

  //       })

  //     }
  //   })
  // }
}
