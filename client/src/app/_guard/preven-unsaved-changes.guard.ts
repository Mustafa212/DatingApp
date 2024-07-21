import { CanDeactivateFn } from '@angular/router';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';

export const prevenUnsavedChangesGuard: CanDeactivateFn<MemberEditComponent> = (component) => {

  if(component.editForm?.dirty){
    return confirm("Are you sure u wanna exit ? all changes  will be lost :(")

  }
  return true;
};
