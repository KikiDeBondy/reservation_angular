import {Component, inject} from '@angular/core';
import {UserService} from "../../Services/user.service";
import {User} from "../../models/User";
import {CommonModule, DatePipe} from "@angular/common";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-account',
  imports: [
    DatePipe,
    CommonModule,
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {

  private userService = inject(UserService);
  private http = inject(HttpClient);

  user!: any;

  // Fausse donnée pour les réservations passées
  pastReservations = [
    { id: 1, date: '2024-12-15T14:00:00Z', service: 'Coupe de cheveux', status: 'completed' },
    { id: 2, date: '2024-11-20T10:00:00Z', service: 'Coloration', status: 'completed' }
  ];

  // Fausse donnée pour les réservations à venir
  upcomingReservations = [
    { id: 3, date: '2025-02-10T12:00:00Z', service: 'Permanente', status: 'upcoming' },
    { id: 4, date: '2025-03-05T09:00:00Z', service: 'Coiffure pour mariage', status: 'upcoming' }
  ];
  ngOnInit() {
    this.showUser(1); // Remplacez 1 par l'ID de l'utilisateur que vous souhaitez afficher
  }

  showUser(id: number){
    this.userService.showUser(id).subscribe({
      next: (res) => {
        this.user = res;
        this.user = this.user.user;
      },
      error: (err) => {
        console.error(err);
      }
    });

  }

}
