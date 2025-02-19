import {Component, inject} from '@angular/core';
import {CommonModule, DatePipe, NgClass} from "@angular/common";
import {ReservationService} from "../../Services/reservation.service";
import {User} from "../../models/User";
import {AuthentificationService} from "../../Services/auth/authentification.service";
import {Reservation} from "../../models/Reservation";
import {SlotService} from "../../Services/slot.service";
import {Slot} from "../../models/Slot";
import {AlertService} from "../../Services/alert/alert.service";
import {forkJoin} from "rxjs";
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-reservation',
  imports: [
    CommonModule,
  ],
  templateUrl: './reservation.component.html',
  standalone: true,
  styleUrl: './reservation.component.css'
})
export class ReservationComponent {
  private auth = inject(AuthentificationService);
  private reservationService = inject(ReservationService);
  private datePipe = inject(DatePipe);
  private alert = inject(AlertService);
  private currentUser!: User;
  currentPage: number = 0;
  hasMorePages: boolean= true;

  ngOnInit() {
    this.getAvailibilitiesOfBarber(2,0)
    this.currentUser = this.auth.getUserFromStorage();
  }

  // Fonction pour réserver un créneau horaire
  bookSlot(day: string, hour: Date, slot: Slot) {
    // Formatage des dates
    const {date, start, end} = this.formatAndValidateDate(day, hour);
      this.alert.confirmAlert(start, "Vous êtes sur le point de réserver ce créneau horaire. Voulez-vous continuer ?")
        .then((result) => {
        if (result.isConfirmed && this.currentUser) {

          //Ajouter la réservation du client
          const newEvent: Reservation = {
            title: this.currentUser.name + ' ' + this.currentUser.forename,
            start: start,
            end: end,
            client_id: this.currentUser.id,
            barber_id: 2,
            slot_id: slot.id
          }

          //TODO: Déprécier, check une autre méthode (si une erreur, annuler les deux)
          forkJoin({
            reservation: this.reservationService.addReservation(newEvent).pipe(
              catchError((err) => {
                this.alert.errorAlert(`${err.message}`, err.statusText);
                throw err; // Relancer l'erreur pour empêcher la suite du processus
              })
            ),
            slotUpdate: this.slotsService.slotUpdate(slot.id, slot.is_reserved).pipe(
              catchError((err) => {
                this.alert.errorAlert(`${err.message}`, err.statusText);
                throw err; // Relancer l'erreur pour empêcher la suite du processus
              })
            )
          }).subscribe()

          // Enlever la date du tableau
          const date = new Date(slot.date);
          this.groupedSlots[date.toISOString()] = this.groupedSlots[date.toISOString()].filter(
            (x) => x.slot.id !== slot.id
          );

        }
      });
  }

  formatAndValidateDate(day: string, hour: Date){
    // Formatage des dates
    const date = this.datePipe.transform(day, "dd/MM/yyyy");
    const startTime = this.datePipe.transform(hour, "HH:mm:ss");
    const start = date+' '+ startTime;

    const endTime = new Date(hour);
    endTime.setMinutes(hour.getMinutes() + 30);
    const formattedEnd = this.datePipe.transform(endTime, "HH:mm:ss");
    const end = date+' '+formattedEnd;

    if (!date || !start || !end)
      throw new Error("Le formatage des dates ont échoué.");

    // Retourner les valeurs formatées
    return { date, start, end };
  }



  private slotsService = inject(SlotService);
  protected slots : Slot[] = [];

  getAvailibilitiesOfBarber(id: number, page: number) {
    this.slotsService.availibilitiesOfBarber(id, page).subscribe({
      next: (data) => {
        console.log(data)
        if (Array.isArray(data))
          this.slots = data;
        this.groupSlotByDate()
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  groupedSlots: { [key: string]: { date: Date, slot: Slot }[] } = {};

  groupSlotByDate() {
    this.groupedSlots = {}
    this.slots.forEach(slot => {
      const date = new Date(slot.date);
      const start = new Date(slot.start);
      start.setMinutes(start.getMinutes() + start.getTimezoneOffset()); // Ajuste l'heure en fonction du fuseau horaire local

      // On utilise l'ISO string de la date pour la clé
      const dateKey = date.toISOString();

      // Si la clé n'existe pas encore, on l'initialise avec un tableau vide
      if (!this.groupedSlots[dateKey]) {
        this.groupedSlots[dateKey] = [];
      }

      // On ajoute un objet contenant l'heure et l'ID du slot
      this.groupedSlots[dateKey].push({ date: start, slot: slot });
    });
  }

  // Pour itérer dans le template, tu peux extraire les entrées de groupedSlots
  getGroupedSlotsEntries() {
    return Object.entries(this.groupedSlots);  // Retourne un tableau de [date, slots]
  }

  previousPage(){
    this.currentPage--
    this.getAvailibilitiesOfBarber(2,this.currentPage)
  }
  nextPage(){
    this.currentPage++;
    this.getAvailibilitiesOfBarber(2,this.currentPage)
  }

}
