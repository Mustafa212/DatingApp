import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MembersListComponent } from './members/members-list/members-list.component';
import { MembersDetailComponent } from './members/members-detail/members-detail.component';
import { MessagesComponent } from './messages/messages.component';
import { authGuard } from './_guard/auth.guard';

export const routes: Routes = [

    {path:"" , component:HomeComponent},
    {
        path:"" ,
        runGuardsAndResolvers:"always",
        canActivate:[authGuard],
        children:[
            {path:"members" , component:MembersListComponent},
            {path:"members/:id" , component:MembersDetailComponent},
            {path:"lists" , component:ListsComponent},
            {path:"messages" , component:MessagesComponent},

        ]
    
    
    },

    {path:"**" , component:HomeComponent , pathMatch:"full"},
];
