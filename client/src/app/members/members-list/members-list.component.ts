import { Component, inject, OnInit } from '@angular/core';
import { MembersService } from '../../_Services/members.service';
import { Member } from '../../_models/Members';
import { MemberCardComponent } from "../member-card/member-card.component";

@Component({
  selector: 'app-members-list',
  standalone: true,
  imports: [MemberCardComponent],
  templateUrl: './members-list.component.html',
  styleUrl: './members-list.component.css'
})
export class MembersListComponent implements OnInit {

  private memberservice = inject(MembersService)
  members:Member[] = []
  ngOnInit(): void {
    this.loadMembers()
  }
  loadMembers(){
    return this.memberservice.getMembers().subscribe(
      {
        next: users => this.members = users
      }
    )
  }

}
