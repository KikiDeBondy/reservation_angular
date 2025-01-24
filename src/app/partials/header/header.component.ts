import {Component} from '@angular/core';
import { RouterLink} from "@angular/router";
import {User} from "../../models/User";
import {AuthentificationService} from "../../Services/auth/authentification.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  currentUser: User | null = null;

  constructor(private authService: AuthentificationService) {}

  ngOnInit(): void {
    // S'abonner à l'état de l'utilisateur
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout() {
    this.authService.logout();
  }
}
