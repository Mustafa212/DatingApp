import { Component, inject, OnInit } from '@angular/core';
import { MembersService } from '../../_Services/members.service';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../_models/Members';
import { TabsModule } from 'ngx-bootstrap/tabs';
import {GalleryItem, GalleryModule, ImageItem}from'ng-gallery'
@Component({
  selector: 'app-members-detail',
  standalone: true,
  imports: [TabsModule , GalleryModule],
  templateUrl: './members-detail.component.html',
  styleUrl: './members-detail.component.css'
})
export class MembersDetailComponent implements OnInit{

  private membersService = inject(MembersService)
  private router = inject(ActivatedRoute)

  member?:Member;
  images:GalleryItem[]=[];

  ngOnInit(): void {
    this.loadmember()
  }
  loadmember(){
    const username = this.router.snapshot.paramMap.get("username")
    if (!username) {
      return
    }

    this.membersService.getMember(username).subscribe({
      next:member => {
        this.member=member
        member.photos.map((p)=>{
          this.images.push(new ImageItem({src:p.url , thumb:p.url}))

        })
      
      }
    })
  }

}
