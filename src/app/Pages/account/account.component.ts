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
import {Slot} from "../../models/Slot";
import {AlertService} from "../../Services/alert/alert.service";
import {LoaderComponent} from "../../loader.component";

@Component({
  selector: 'app-account',
    imports: [
        DatePipe,
        CommonModule,
        Button,
        LoaderComponent,
    ],
  templateUrl: './account.component.html',
  standalone: true,
  styleUrl: './account.component.css'
})
export class AccountComponent {

  protected readonly Date = Date;
  private readonly auth = inject(AuthentificationService);
  private readonly reservationService = inject(ReservationService);
  private readonly slotService = inject(SlotService);
  private readonly alertsService = inject(AlertService);

  user!: User | null;
  reservations: Reservation[] = [];
  loader = false;

  date = new Date();
  dateUTC = new Date(Date.UTC(this.date.getUTCFullYear(), this.date.getUTCMonth(), this.date.getUTCDate(), this.date.getUTCHours(), this.date.getUTCMinutes()));

  ngOnInit() {
    this.user = this.auth.getUserFromStorage();
    if (this.user) {
      this.showReservationByUser(this.user.id);
    }
  }

  showReservationByUser(id: number){
    this.loader = true;
    this.reservationService.showReservationByUser(id).subscribe({
      next: (res) => {
        this.loader = false;
        this.reservations = res;
        console.log(res);
      },
      error: (err) => {
        this.loader = false;
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


  deleteReservation(id: number | undefined, slot_id: number) {
    this.reservationService.deleteReservation(id, this.user?.id).subscribe({
      next: () => {
        this.slotService.slotUpdate(slot_id, true).subscribe({//TODO: true à changer par slot.is_reserved (normalement tjrs true)
            next: ()=>{
              this.reservations = this.reservations.filter((reservation) => reservation.id !== id);
            },
          error: (err) => {
             this.alertsService.errorAlert(`${err.message}`, err.statusText)
          }
        })
      },
      error: (err) => {
        console.error(err.message);
        this.alertsService.errorAlert(`${err.message}`, err.statusText);
      }
    });
  }
}
