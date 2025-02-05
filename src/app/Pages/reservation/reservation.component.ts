import {Component, inject} from '@angular/core';
import {CommonModule, DatePipe, NgClass} from "@angular/common";
import {ReservationService} from "../../Services/reservation.service";
import {data} from "autoprefixer";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {Button, ButtonModule} from "primeng/button";
import {ToastModule} from "primeng/toast";
import {ConfirmationService, MessageService} from "primeng/api";
import Swal from "sweetalert2";
import {User} from "../../models/User";
import {AuthentificationService} from "../../Services/auth/authentification.service";
import {Reservation} from "../../models/Reservation";
@Component({
  selector: 'app-reservation',
  imports: [
    DatePipe,
    NgClass,
    CommonModule,
    Button
  ],
  templateUrl: './reservation.component.html',
  standalone: true,
  styleUrl: './reservation.component.css'
})
export class ReservationComponent {
  private today = new Date();
  private auth = inject(AuthentificationService);
  private reservationService = inject(ReservationService);
  private currentUser!: User | null;
  currentWeekNumber = 1;  // Numéro de la semaine actuelle
  days: any;
  private currentReservation!: Reservation[];
  isPreviousDisabled = true;  // Le bouton précédent est désactivé par défaut

  async ngOnInit() {
    this.currentUser = this.auth.getUserFromStorage();
    await this.getReservations(this.today);
    this.days = this.generateWeek(this.today);  // Génère la semaine actuelle
  }
  async getReservations(date : Date){
    const formatedDate = date.toLocaleDateString().replaceAll('/', '-');
    return new Promise((resolve, reject) => {
      this.reservationService.weeklyReservation(formatedDate).subscribe({
        next: (data) => {
          this.currentReservation = data;
          resolve(data);
        },
        error: (error) => {
          console.error(error);
          reject(error);
        }
      });
    });
  }

  // Fonction qui génère les jours de la semaine avec les horaires
  generateWeek(startDate: Date) {
    const daysOfWeek = [];
    const currentDate = new Date(startDate);

    // Crée les jours de la semaine avec horaires
    for (let i = 0; i < 7; i++) {
      const day = new Date(currentDate);
      day.setDate(day.getDate() + i);

      const hours = this.generateDayHours(day);

      daysOfWeek.push({ date: day, hours });
    }
    return daysOfWeek;
  }

  // Fonction qui génère les horaires pour chaque jour
  generateDayHours(day: Date) {
    const hours = [];
    let hour = 7; // Commence à 7h
    let minute = 0; // Initialisation des minutes

    // Boucle pour chaque créneau horaire de 30 minutes
    while (hour <= 20) { // Jusqu'à 20h
      const start = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), hour, minute)); // Créer en UTC, pour éviter les problèmes de fuseau horaire
      const end = new Date(start);
      end.setMinutes(start.getMinutes() + 30); // Le créneau dure 30 minutes

      // Formater l'heure pour l'affichage (00:00 - 00:30)
      const formattedStartTime = `${hour < 10 ? '0' + hour : hour}:${minute === 0 ? '00' : '30'}`;

      // Ajouter les horaires dans le tableau
      hours.push({
        time: `${formattedStartTime} `,
        isBooked: this.isBooked(start, end) // Vérifie si le créneau est réservé
      });

      // Avancer de 30 minutes
      minute = minute === 0 ? 30 : 0; // Alterner entre 00 et 30
      if (minute === 0) hour++; // Si minute revient à 00, augmenter l'heure
    }

    return hours;
  }



  // Fonction qui vérifie si un créneau est réservé
  isBooked(start: Date, end: Date) {
    if (!this.currentReservation || !Array.isArray(this.currentReservation)) {
      return false;
    }

    return this.currentReservation.some(event => {
      const eventStart = new Date(event.start);
      const eventStartUTC = new Date(Date.UTC(eventStart.getUTCFullYear(), eventStart.getUTCMonth(), eventStart.getUTCDate(), eventStart.getUTCHours(), eventStart.getUTCMinutes()));

      // Comparer start et eventStart en UTC
      return start.getTime() === eventStartUTC.getTime(); // Comparer les timestamps
    });
  }


  // Fonction pour passer à la semaine suivante
  nextWeek() {
    this.currentWeekNumber++;
    const nextStartDate = new Date(this.days[0].date);
    nextStartDate.setDate(nextStartDate.getDate() + 7); // Avance de 7 jours
    this.days = this.generateWeek(nextStartDate);
    this.isPreviousDisabled = false;  // Active le bouton précédent
  }

  // Fonction pour passer à la semaine précédente
  previousWeek() {
    if (this.currentWeekNumber > 1) {
      this.currentWeekNumber--;
      const previousStartDate = new Date(this.days[0].date);
      previousStartDate.setDate(previousStartDate.getDate() - 7); // Recule de 7 jours
      this.days = this.generateWeek(previousStartDate);
    }

    // Désactive le bouton précédent si on est sur la semaine actuelle
    if (this.currentWeekNumber === 1) {
      this.isPreviousDisabled = true;
    }
  }

  // Fonction pour réserver un créneau horaire
  bookSlot(day: any, hour: any) {
    if (!hour.isBooked) {

      // Extraire l'heure et les minutes de hour.time (par exemple "07:00")
      const [startHour, startMinute] = hour.time.split(':');
      // Créer la date de début et de fin à partir de la date du jour et de l'heure sélectionnée
      const startDate = new Date(day);
      startDate.setHours(parseInt(startHour), parseInt(startMinute), 0, 0); // Définir l'heure, les minutes, les secondes et les millisecondes

      // La fin de l'événement est 30 minutes après le début
      const endDate = new Date(startDate);
      endDate.setMinutes(startDate.getMinutes() + 30); // Ajouter 30 minutes
      Swal.fire({
        title: startDate.toLocaleString(),
        text: "Vous êtes sur le point de réserver ce créneau horaire. Voulez-vous continuer ?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#41a60f",
        cancelButtonColor: "#d33",
        confirmButtonText: "Réserver"
      }).then((result) => {
        if (result.isConfirmed && this.currentUser) {
            const newEvent: Reservation = {
              title: this.currentUser.name + ' ' + this.currentUser.forename,
              start: startDate.toLocaleString(),
              end: endDate.toLocaleString(),
              client_id: this.currentUser?.id || 0,
              barber_id: 6
            }
          this.reservationService.addReservation(newEvent).subscribe({
            next: (event) => {
              this.currentReservation = this.currentReservation.concat(event);
              Swal.fire({
                title: "Réservé !",
                text: "Vous avez bien réservé ce créneau horaire. Vous pouvez consulter vos réservations dans votre espace client.",
                icon: "success"
              });
            },
            error: (error) => {
              console.error(error);
              Swal.fire({
                title: "Erreur !",
                text: "Une erreur s'est produite lors de la réservation. Veuillez réessayer.",
                icon: "error"
              });
            }
          });
        }
      });
      hour.isBooked = true;
    }
  }


}
