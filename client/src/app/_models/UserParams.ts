import { User } from "./user";

export class UserParams{
    gender:string
    orderBy:string = 'lastActive'

    minAge:number = 18
    maxAge:number = 80
    pageNumber:number = 1
    pageSize:number = 5
    constructor(user:User | null) {
        this.gender = user?.gender === 'female'? 'male' :'female'
        
    }
}