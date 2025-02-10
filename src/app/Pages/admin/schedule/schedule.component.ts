import {Component, inject} from '@angular/core';
import {
  EventSettingsModel,
  ScheduleAllModule,
  EventRenderedArgs
} from "@syncfusion/ej2-angular-schedule";
import {ReservationService} from "../../../Services/reservation.service";
import {Reservation} from "../../../models/Reservation";
import { loadCldr } from '@syncfusion/ej2-base';
import frNumberData from '@syncfusion/ej2-cldr-data/main/fr-CH/numbers.json';
import frtimeZoneData from '@syncfusion/ej2-cldr-data/main/fr-CH/timeZoneNames.json';
import frGregorian from '@syncfusion/ej2-cldr-data/main/fr-CH/ca-gregorian.json';
import frNumberingSystem from '@syncfusion/ej2-cldr-data/supplemental/numberingSystems.json';
loadCldr(frNumberData, frtimeZoneData, frGregorian, frNumberingSystem);



@Component({
  selector: 'app-schedule',
  imports: [
    ScheduleAllModule
  ],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent {

  private readonly reservationService = inject(ReservationService);

  todayStringDate = new Date().toLocaleString();
  reservations: Reservation[] = [];

  public eventSettings: EventSettingsModel = {
    dataSource: this.reservations,
    allowAdding: false,
    allowDeleting: false,
    allowEditing: false,
  }
  ngOnInit() {
    this.getReservation();
  }

  getReservation() {
    this.todayStringDate = this.todayStringDate.replaceAll('/', '-');
    this.reservationService.reservation().subscribe({
      next: (reservations) => {
        this.reservations = reservations.map((reservation: { id: any; title: any; start: string | number | Date; end: string | number | Date; barber: any; client: any; }) => {
          return {
            Id: reservation.id,
            Subject: reservation.title,
            StartTime: reservation.start,
            EndTime: reservation.end,
            Barber: reservation.barber,
            Client: reservation.client,
          };
        });

        this.eventSettings = { dataSource: this.reservations };
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
  onEventRendered(args: EventRenderedArgs): void {
    //3 premier élements de la date
    const date = args.data['StartTime'].toString().substring(0, 3);
    switch (date) {
      case 'Mon':
        (args.element as HTMLElement).style.backgroundColor = '#F57F17';
        break;
      case 'Tue':
        (args.element as HTMLElement).style.backgroundColor = '#b0c814';
        break;
      case 'Wed':
        (args.element as HTMLElement).style.backgroundColor = '#8e24aa';
        break;
      case 'Thu':
        (args.element as HTMLElement).style.backgroundColor = '#2482aa';
        break;
      case 'Fri':
        (args.element as HTMLElement).style.backgroundColor = '#aa2434';
        break;
      case 'Sat':
        (args.element as HTMLElement).style.backgroundColor = '#41aa24';
        break;
    }
  }





}
