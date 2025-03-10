import {Component, OnInit, OnDestroy, inject} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";
import {LoaderComponent} from "../../loader.component";
import {Message} from "primeng/message";
import {Reservation} from "../../models/Reservation";
import {ReservationService} from "../../Services/reservation.service";
import {AuthentificationService} from "../../Services/auth/authentification.service";
import {User} from "../../models/User";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, RouterLink, LoaderComponent, Message],
  standalone: true,
  animations: [
    //Animations des images de droite à gauche
    trigger('fadeSlide', [
      transition(':enter', [
        style({transform: 'translateX(100%)'}),
        animate('1s ease-in-out', style({transform: 'translateX(0)'}))
      ]),
      transition(':leave', [
        animate('1s ease-in-out', style({transform: 'translateX(-100%)'}))
      ])
    ]),
    //Animation du texte de bas en haut
    trigger('fadeUp', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateY(50px)'}),
        animate('2s 1s ease-out', style({opacity: 1, transform: 'translateY(0)'}))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, OnDestroy {

  reservationService = inject(ReservationService);
  auth = inject(AuthentificationService);

  images: string[] = [
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1674&q=80',
    'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80',
    'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80',
    'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80'
  ];
  currentIndex: number = 0;
  animateState = true;
  private interval: any;
  nextReservation: Reservation|null = null
  loader = false;
  user!: User;

  ngOnInit() {
    //Parcourir les images toutes les 8sec (boucle)
    this.interval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 8000);
    this.user = this.auth.getUserFromStorage();
    this.getNextReservation()
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  getNextReservation() {
    this.reservationService.nextReservation(this.user.id).subscribe({
      next: (res) => {
        console.log(res);
        this.nextReservation = res;
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
}
