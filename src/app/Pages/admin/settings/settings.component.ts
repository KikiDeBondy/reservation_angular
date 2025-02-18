import {Component, inject, signal} from '@angular/core';
import {SlotService} from "../../../Services/slot.service";
import {Slot} from "../../../models/Slot";
import {CommonModule, DatePipe, NgClass} from "@angular/common";
import {
  MatAccordion,
  MatExpansionModule,
} from "@angular/material/expansion";
import {MatDialog} from "@angular/material/dialog";
import {DatePickerComponent} from "../../../partials/dialog/date-picker/date-picker.component";
import {AuthentificationService} from "../../../Services/auth/authentification.service";
import {AlertService} from "../../../Services/alert/alert.service";
import {User} from "../../../models/User";


@Component({
  selector: 'app-settings',
  imports: [
    NgClass,
    DatePipe,
    CommonModule,
    MatAccordion,
    MatExpansionModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

  private readonly slotService = inject(SlotService);
  private readonly dialog = inject(MatDialog);
  private readonly auth = inject(AuthentificationService);
  private readonly alert = inject(AlertService);

  currentUser!: User;
  groupedSlots: { [key: string]: { date: Date, slot: Slot }[] } = {};
  currentPage: number = 0;
  pageSize: number = 7;
  hasMorePages: boolean = true;


  ngOnInit() {
    this.currentUser = this.auth.getUserFromStorage()
    this.getSlotsOfBarber(this.currentUser.id, this.currentPage)
  }

  getSlotsOfBarber(id: number, currentPage: number){
    this.slotService.planningOfBarber(id, currentPage).subscribe({
      next: (data) => {
        if(Array.isArray(data)){
          this.groupSlotByDate(data)
        }
        console.log(this.getGroupedSlotsEntries());
      },
      error: err => {}
    })
  }
  toggleReservation(slot: Slot) {
    this.slotService.slotUpdate(slot.id, slot.is_reserved).subscribe({
      next: () => {
        slot.is_reserved = !slot.is_reserved;
      },
      error: err => {
        console.log(err);
      }
    })
  }
  groupSlotByDate(slot : Slot[]) {
    //Reset le tableau
    this.groupedSlots = {};
    slot.forEach(slot => {
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
    this.hasMorePages = Object.keys(this.groupedSlots).length === this.pageSize;
    console.log('aaa',Object.keys(this.groupedSlots).length, this.hasMorePages)

  }

  // Pour itérer dans le template, tu peux extraire les entrées de groupedSlots
  getGroupedSlotsEntries() {
    return Object.entries(this.groupedSlots);  // Retourne un tableau de [date, slots]
  }

  addSlot() {
    this.dialog.open(DatePickerComponent, {
      height : '400px',
      width : '800px',
      data: { name: 'addSlot' }
    }).afterClosed().subscribe({
      next: (res) => {
        if(res){
          const data = {
            barber_id: this.currentUser.id,
            start_date: res.start,
            end_date:res.end,
          }
          this.slotService.generateSlot(data).subscribe({
            next: () => {
              this.alert.successAlert('Succès !', 'Vous venez d\'enregistrer vos nouveaux créneaux.');
            },
            error: error => {
              console.log(error)
              this.alert.errorAlert('Erreur génération de créneaux', error.error.message)
            }
          })
        }
      }
    })
  }

  markAsAbsent() {
    this.dialog.open(DatePickerComponent, {
      height : '400px',
      width : '800px',
      data: { name: 'absent' }
    }).afterClosed().subscribe({
      next: (res) => {
        if(res){
          const data = {
            barber_id: this.currentUser.id,
            start_date: res.start,
            end_date:res.end,
          }
          this.slotService.absenceOfBarber(this.currentUser.id,data).subscribe({
            next: () => {
              this.getSlotsOfBarber(this.currentUser.id, this.currentPage)
              this.alert.successAlert('Succès !', 'Votre absence à bien été prise en compte');
            },
            error: error => {
              console.log(error)
              this.alert.errorAlert('Erreur génération de créneaux', error.error.message)
            }
          })
        }
      }
    })
  }

  previousPage() {
    this.currentPage--
    this.getSlotsOfBarber(this.currentUser.id, this.currentPage);
  }

  nextPage() {
    this.currentPage++
    this.getSlotsOfBarber(this.currentUser.id, this.currentPage)
  }
}
