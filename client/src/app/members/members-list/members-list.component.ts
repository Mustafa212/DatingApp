import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MembersService } from '../../_Services/members.service';
import { MemberCardComponent } from "../member-card/member-card.component";
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@Component({
  selector: 'app-members-list',
  standalone: true,
  imports: [MemberCardComponent , PaginationModule , FormsModule , ButtonsModule],
  templateUrl: './members-list.component.html',
  styleUrl: './members-list.component.css'
})
export class MembersListComponent implements OnInit  , OnDestroy{

  memberservice = inject(MembersService)
  
  
  ngOnInit(): void {


    if (!this.memberservice.paginatedResult()) {
      
      this.loadMembers()
    }
  }
  loadMembers(){
    return this.memberservice.getMembers()
  }


  resetFilters(){
    this.memberservice.resetUserParams()
    this.loadMembers()
  }

  pageChanged(event:any){
    if (this.memberservice.userParams().pageNumber !== event.page) {
      this.memberservice.userParams().pageNumber = event.page
      this.loadMembers()

    }
  }
  ngOnDestroy(): void {
    this.memberservice.paginatedResult.set(null)
}
}
