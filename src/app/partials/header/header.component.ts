import {Component} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {User} from "../../models/User";
import {AuthentificationService} from "../../Services/auth/authentification.service";
import {CommonModule, NgClass} from "@angular/common";

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    CommonModule,
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  currentUser: User | null = null;
  protected isHomePage: boolean = false;
  isAdmin: boolean = false;

  constructor(private authService: AuthentificationService, private router: Router) {
    this.router.events.subscribe(() => {
      this.isHomePage = ['/','/login'].includes(this.router.url);
    });
  }

  ngOnInit(): void {
    // S'abonner à l'état de l'utilisateur
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.isAdmin = this.authService.isAdmin();
  }

  logout() {
    this.authService.logout();
  }
}
