import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { AccountService } from '../../_Services/account.service';
import { MembersService } from '../../_Services/members.service';
import { Member } from '../../_models/Members';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PhotoEditorComponent } from "../photo-editor/photo-editor.component";
import { TimeagoModule } from 'ngx-timeago';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [TabsModule, FormsModule, PhotoEditorComponent , TimeagoModule , DatePipe],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css'
})
export class MemberEditComponent implements OnInit{
 

  @ViewChild("editForm") editForm?:NgForm
  @HostListener("window:beforeunload" , ["$event"] ) notify($event:any){

    if (this.editForm?.dirty) {
      $event.returnValue  =true
    }
  }


  private accountservice = inject(AccountService)
  private memberservice = inject(MembersService)
  private toast = inject(ToastrService)

  member?:Member

  ngOnInit(): void {
    this.loadmember()
  }

  loadmember(){
    const user = this.accountservice.currentuser() 
    if (!user) return;
      
  
    this.memberservice.getMember(user.username).subscribe({
      next: mem => this.member = mem
    })
  }


  updatemember(){
    this.memberservice.updateMember(this.editForm?.value).subscribe({
      next:_=>{
        this.toast.success("profile Updated Successfully")
        this.editForm?.reset(this.member)

      }
    })
    
  }

  onMemberChange(event:Member){
    this.member = event
  }
}
