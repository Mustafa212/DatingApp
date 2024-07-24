import { Component, inject, input, OnInit, output } from '@angular/core';
import { Member } from '../../_models/Members';
import { DecimalPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { AccountService } from '../../_Services/account.service';
import { environment } from '../../../environments/environment';
import { Photo } from '../../_models/Photo';
import { MembersService } from '../../_Services/members.service';

@Component({
  selector: 'app-photo-editor',
  standalone: true,
  imports: [NgIf,NgFor,NgClass,FileUploadModule , NgStyle, DecimalPipe],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.css'
})
export class PhotoEditorComponent implements OnInit{
  member = input.required<Member>();
  
  private accountservice = inject(AccountService)
  private membersService = inject(MembersService)
  uploader?:FileUploader
  hasBaseDropZoneOver=false
  baseUrl = environment.apiUrl

  memberChange = output<Member>()




  ngOnInit(): void {
    this.initializeUploader()


  }


  fileOverBase(e:any){
    this.hasBaseDropZoneOver =e
  }
  deletePhoto(photo:Photo){
    this.membersService.deletePhoto(photo).subscribe({
      next:_=>{
        const updatedMember = {...this.member()}
        updatedMember.photos = updatedMember.photos.filter(x=> x.id!== photo.id)
        this.memberChange.emit(updatedMember)     
       }
    })
  }
  setMainPhoto(photo:Photo){
    this.membersService.setMainPhoto(photo).subscribe({
      next:_=>{
        const user = this.accountservice.currentuser()
        if (user) {
          user.photoUrl = photo.url
          this.accountservice.setCurrentUser(user)
        }

        const updatedMember = {...this.member()}
        updatedMember.photoUrl = photo.url
        updatedMember.photos.forEach((p)=>{
          if(p.isMain) p.isMain =false
          if (p.id === photo.id) {
            p.isMain = true
          }

        })
        this.memberChange.emit(updatedMember)     
       }
    })
  }


  initializeUploader(){
    this.uploader = new FileUploader({
      url:this.baseUrl+'users/add-photo',
      authToken:'Bearer '+ this.accountservice.currentuser()?.token,
      isHTML5:true,
      allowedFileType:["image"],
      removeAfterUpload:true,
      autoUpload:false,
      maxFileSize:10*1024*1024
    })

    this.uploader.onAfterAddingFile=(file)=>{
      file.withCredentials = false

    }
    this.uploader.onSuccessItem = (item , response , status , header)=>{


      const photo = JSON.parse(response)
      const updatedMember = {...this.member()}
      updatedMember.photos.push(photo)

      this.memberChange.emit(updatedMember)
      if (photo.isMain) {
        const user = this.accountservice.currentuser()
      if (user) {
        user.photoUrl = photo.url
        this.accountservice.setCurrentUser(user)
        updatedMember.photoUrl = photo.url
        this.memberChange.emit(updatedMember)  
      }
   
      }
      

    }
  }
}
