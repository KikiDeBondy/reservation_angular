import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../models/User";
import {apiUrl} from "../environment/local";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);
  constructor() { }

  showUser(id: number) {
    return this.http.get<User>(apiUrl+'/api/user/' + id);
  }

}
