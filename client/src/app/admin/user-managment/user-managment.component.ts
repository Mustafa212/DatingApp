import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { AdminService } from '../../_Services/admin.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { RolesModalComponent } from '../../modals/roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-managment',
  standalone: true,
  imports: [],
  templateUrl: './user-managment.component.html',
  styleUrl: './user-managment.component.css'
})
export class UserManagmentComponent implements OnInit {
  Users:User[] =[]
  private adminService= inject(AdminService)
  private ModalService= inject(BsModalService)
  bsModalRef:BsModalRef<RolesModalComponent> = new BsModalRef<RolesModalComponent>

  ngOnInit(): void {
    this.getUsersWithRoles()    
  }

  openRolesModal(user:User){
    const initialState:ModalOptions={
      class:'modal-lg',
      initialState:{
        title:'User roles',
        username:user.username,
        availableRoles:['Admin' , 'Moderator' , 'Member'],
        users:this.Users,
        selectedRoles:[...user.roles],
        rolesUpdated:false
      }
    }

    this.bsModalRef = this.ModalService.show(RolesModalComponent ,initialState)
    this.bsModalRef.onHide?.subscribe({
      next:()=>{
        if (this.bsModalRef.content && this.bsModalRef.content.rolesUpdated) {
          const selectedRoles = this.bsModalRef.content.selectedRoles
          this.adminService.updateUserRoles(user.username , selectedRoles).subscribe({
            next:(roles)=>{
              user.roles =roles
            }
          })
        }
      }
    })
  }

  getUsersWithRoles(){
    this.adminService.getUsersWithRoles().subscribe({
      next:users=> {this.Users = users
        console.log(this.Users);
        
        
      }
    })
  }

}
