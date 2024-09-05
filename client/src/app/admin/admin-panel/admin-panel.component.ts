import { Component } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { HasRoleDirective } from '../../_directives/has-role.directive';
import { UserManagmentComponent } from '../user-managment/user-managment.component';
import { PhotoManagmentComponent } from '../photo-managment/photo-managment.component';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [TabsModule , HasRoleDirective , UserManagmentComponent , PhotoManagmentComponent],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent {

}
