import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../_models/Members';
import { RouterLink } from '@angular/router';
import { LikesService } from '../../_Services/likes.service';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [RouterLink , NgClass , NgStyle],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css'
})
export class MemberCardComponent {
  members = input.required<Member>()
  private likeService = inject(LikesService)
  
  hasLiked = computed(()=>this.likeService.likedIds().includes(this.members().id))


  toggleLike(){
    this.likeService.toggleLike(this.members().id).subscribe({
      next:()=>{
        if (this.hasLiked()) {
          this.likeService.likedIds.update(ids => ids.filter(x => x !== this.members().id))

        }
        else{
          this.likeService.likedIds.update(ids =>  [...ids, this.members().id])

        }
      }
    })
  }

}
