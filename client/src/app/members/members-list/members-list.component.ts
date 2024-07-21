import { Component, inject, OnInit } from '@angular/core';
import { MembersService } from '../../_Services/members.service';
import { MemberCardComponent } from "../member-card/member-card.component";

@Component({
  selector: 'app-members-list',
  standalone: true,
  imports: [MemberCardComponent],
  templateUrl: './members-list.component.html',
  styleUrl: './members-list.component.css'
})
export class MembersListComponent implements OnInit {

  memberservice = inject(MembersService)
  ngOnInit(): void {
    if (this.memberservice.members().length === 0) {
      
      this.loadMembers()
    }
  }
  loadMembers(){
    return this.memberservice.getMembers()
  }

}
