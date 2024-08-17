import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { LikesService } from '../_Services/likes.service';
import { Member } from '../_models/Members';
import { MemberCardComponent } from "../members/member-card/member-card.component";
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [ButtonsModule, FormsModule, MemberCardComponent , PaginationModule],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css'
})
export class ListsComponent implements OnInit , OnDestroy {
   likeService = inject(LikesService)

  predicate = "liked"

  pageNumber = 1
  pageSize = 5
  ngOnInit(): void {
    

      this.loadLikes()
  }

  getTitle(){
    switch(this.predicate)
    {
      case 'liked' :return 'People You like'
      case 'likedBy' :return 'People Who Liked you'
      default : return 'mutual'
      
    }
  }

  
  loadLikes(){
    this.likeService.getLikes(this.predicate , this.pageNumber , this.pageSize )

  }
  pageChanged(event:any){
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page
      this.loadLikes()
    }

  }

  ngOnDestroy(): void {
      this.likeService.paginatedResult.set(null)
  }

}
