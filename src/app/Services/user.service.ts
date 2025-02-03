import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../models/User";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);
  constructor() { }

  showUser(id: number) {
    return this.http.get<User>('http://localhost:8000/api/user/' + id);
  }

}
