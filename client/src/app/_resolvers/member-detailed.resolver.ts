import { ResolveFn } from '@angular/router';
import { Member } from '../_models/Members';
import { inject } from '@angular/core';
import { MembersService } from '../_Services/members.service';

export const memberDetailedResolver: ResolveFn<Member | null> = (route, state) => {
  const membersService = inject(MembersService)
  const username = route.paramMap.get('username')

  if(!username) return null
  return membersService.getMember(username)
};
