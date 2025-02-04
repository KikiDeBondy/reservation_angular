import {Component, inject} from '@angular/core';
import {CommonModule, DatePipe, NgClass} from "@angular/common";
import {ReservationService} from "../../Services/reservation.service";
import {data} from "autoprefixer";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {Button, ButtonModule} from "primeng/button";
import {ToastModule} from "primeng/toast";
import {ConfirmationService, MessageService} from "primeng/api";
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

  private reservationService = inject(ReservationService);
  test = new Date()
  currentWeekNumber = 1;  // Numéro de la semaine actuelle
  days: any;
  private events1: any;

  ngOnInit(){
    this.events1 = [  // Liste des événements réservés
      { title: 'Meeting', start: new Date('2025-02-05T15:00:00'), end: new Date('2025-02-05T15:30:00') },
      { title: 'Workshop', start: new Date('2025-02-05T10:00:00'), end: new Date('2025-02-05T10:30:00') },
      { title: 'Lunch', start: new Date('2025-02-05T12:30:00'), end: new Date('2025-02-05T13:00:00') }
      // Ajoute plus d'événements ici
    ];
    this.days = this.generateWeek(new Date());  // Génère la semaine actuelle
  }
  isPreviousDisabled = true;  // Le bouton précédent est désactivé par défaut

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
      const start = new Date(day);
      start.setHours(hour, minute, 0, 0); // Définir l'heure et les minutes du créneau

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
    if (!this.events1 || !Array.isArray(this.events1)) {
      return false;
    }

    return this.events1.some(event =>
      start.toString() == event.start.toString()
    );
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
      console.log(startDate.toLocaleString(), endDate.toLocaleString());
      // Exemple : Ajouter l'événement dans la liste des événements réservés
      // const newEvent : Reservation = {
      //   title: 'New Event',
      //   start: startDate.toLocaleString(),
      //   end: endDate.toLocaleString(),
      //   client_id: 1,
      //   barber_id: 2
      // };
      // this.reservationService.addReservation(newEvent).subscribe({
      //   next: (data) => {
      //     console.log(data);
      //   },
      //   error: (error) => {
      //     console.error(error);
      //   }
      // })
      // console.log(newEvent);

      // Marquer le créneau comme réservé
      hour.isBooked = true;
    }
  }


}
