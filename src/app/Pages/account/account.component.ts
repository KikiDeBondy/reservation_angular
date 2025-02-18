import {Component, inject} from '@angular/core';
import {UserService} from "../../Services/user.service";
import {User} from "../../models/User";
import {CommonModule, DatePipe} from "@angular/common";
import {ReservationService} from "../../Services/reservation.service";
import {AuthentificationService} from "../../Services/auth/authentification.service";
import {Reservation} from "../../models/Reservation";
import {Button} from "primeng/button";
import Swal from "sweetalert2";
import {SlotService} from "../../Services/slot.service";

@Component({
  selector: 'app-account',
  imports: [
    DatePipe,
    CommonModule,
    Button,
  ],
  templateUrl: './account.component.html',
  standalone: true,
  styleUrl: './account.component.css'
})
export class AccountComponent {

  protected readonly Date = Date;
  private readonly auth = inject(AuthentificationService);
  private readonly reservationService = inject(ReservationService);

  user!: User | null;
  reservations: Reservation[] = [];

  date = new Date();
  dateUTC = new Date(Date.UTC(this.date.getUTCFullYear(), this.date.getUTCMonth(), this.date.getUTCDate(), this.date.getUTCHours(), this.date.getUTCMinutes()));

  ngOnInit() {
    this.user = this.auth.getUserFromStorage();
    if (this.user) {
      this.showReservationByUser(this.user.id);
    }
  }

  showReservationByUser(id: number){
    this.reservationService.showReservationByUser(id).subscribe({
      next: (res) => {
        this.reservations = res;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  statutColor(reservation: Reservation) {
    // Comparer les deux dates (les deux sont en UTC)
    return this.dateUTC > new Date(reservation.start) ?  'bg-red-100' : 'bg-green-100';
  }
  statut(reservation: Reservation) {
    return this.dateUTC > new Date(reservation.start) ?  'Terminé' : 'A venir';
  }


  deleteReservation(id: number | undefined) {

    this.reservationService.deleteReservation(id, this.user?.id).subscribe({
      next: (res) => {
        this.reservations = this.reservations.filter((reservation) => reservation.id !== id);
      },
      error: (err) => {
        console.error(err.message);
        Swal.fire({
          title: "Hop Hop Hop !",
          text: "Impossible de supprimer cette réservation",
          icon: "error"
        });
      }
    });
  }
}
