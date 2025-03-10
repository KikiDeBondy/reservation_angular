import {Component, inject, LOCALE_ID} from '@angular/core';
import {CommonModule, DatePipe, registerLocaleData} from "@angular/common";
import {ReservationService} from "../../Services/reservation.service";
import {User} from "../../models/User";
import {AuthentificationService} from "../../Services/auth/authentification.service";
import {Reservation} from "../../models/Reservation";
import {SlotService} from "../../Services/slot.service";
import {Slot} from "../../models/Slot";
import {AlertService} from "../../Services/alert/alert.service";
import {forkJoin} from "rxjs";
import {catchError} from 'rxjs/operators';
import {LoaderComponent} from "../../loader.component";
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr);


@Component({
  selector: 'app-reservation',
  imports: [
    CommonModule,
    LoaderComponent,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr' }
  ],
  templateUrl: './reservation.component.html',
  standalone: true,
  styleUrl: './reservation.component.css'
})
export class ReservationComponent {
  private auth = inject(AuthentificationService);
  private reservationService = inject(ReservationService);
  private slotsService = inject(SlotService);
  private datePipe = inject(DatePipe);
  private alert = inject(AlertService);
  private currentUser!: User;
  currentPage: number = 0;
  hasMorePages: boolean= true;
  loader = false;
  groupedSlots: { [key: string]: Slot[] } = {};

  ngOnInit() {
    this.getAvailibilitiesOfBarber(2,0)
    this.currentUser = this.auth.getUserFromStorage();
  }

  // Fonction pour réserver un créneau horaire
  bookSlot(day: string, hour: Date, slot: Slot) {
    // Formatage des dates
    const {start, end} = this.formatAndValidateDate(slot);
      this.alert.confirmAlert(start, "Vous êtes sur le point de réserver ce créneau horaire. Voulez-vous continuer ?")
        .then((result) => {
        if (result.isConfirmed && this.currentUser) {
          this.loader = true;
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
                this.loader = false;
                this.alert.errorAlert(`${err.message}`, err.statusText);
                throw err; // Relancer l'erreur pour empêcher la suite du processus
              })
            ),
            slotUpdate: this.slotsService.slotUpdate(slot.id, slot.is_reserved).pipe(
              catchError((err) => {
                this.loader = false;
                this.alert.errorAlert(`${err.message}`, err.statusText);
                throw err; // Relancer l'erreur pour empêcher la suite du processus
              })
            )
          }).subscribe({
            next: ()=>{
              const date = this.datePipe.transform(slot.date, 'yyyy-MM-dd','utc');
              if(date)
                this.deleteSlotFromDate(date, slot.id)
              this.loader = false;
              this.alert.successAlert('Succès ! ', 'Vous avez réserver votre créneau avec succès')
            },
            error: ()=>{
              this.loader = false;
              this.alert.errorAlert('Erreur', 'Une erreur est survenue lors de la réservation de votre créneau')
            }
          })
                  }
      });
  }
  deleteSlotFromDate(date: string, slotId: number) {
    // Trouver l'entrée correspondant à la date dans groupedSlots
    const dateEntry = Object.entries(this.groupedSlots).find(entry => entry[0] === date);

    // Si la date est trouvée
    if (dateEntry) {
      const [foundDate, slots] = dateEntry;
      this.groupedSlots[foundDate] = slots.filter(slot => slot.id !== slotId); // Mettre à jour l'entrée avec les créneaux filtrés
    }

  }




  formatAndValidateDate(slot: Slot){
    // Formatage des dates
    const date = this.datePipe.transform(slot.date, "dd/MM/yyyy", 'utc');
    const startTime = this.datePipe.transform(slot.start, "HH:mm:ss", 'utc');
    const start = date+' '+ startTime;

    const formattedEnd = this.datePipe.transform(slot.end, "HH:mm:ss", 'utc');
    const end = date+' '+formattedEnd;

    if (!start && !end)
      throw new Error("Le formatage des dates ont échoué.");

    // Retourner les valeurs formatées
    return { start, end, date };
  }




  getAvailibilitiesOfBarber(id: number, page: number) {
    this.loader = true;
    this.slotsService.availibilitiesOfBarber(id, page).subscribe({
      next: (data) => {
        this.groupedSlots = data;
        this.loader = false;
      },
      error: (error) => {
        console.error(error);
        this.loader = false;
      }
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
