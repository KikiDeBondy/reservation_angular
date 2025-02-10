import { Routes } from '@angular/router';
import {HomeComponent} from "./Pages/home/home.component";
import {AuthentificationComponent} from "./auth/authentification/authentification.component";
import {RegisterComponent} from "./auth/register/register.component";
import {AccountComponent} from "./Pages/account/account.component";
import {ReservationComponent} from "./Pages/reservation/reservation.component";
import {authGuard} from "./core/Guard/auth/auth.guard";
import {adminGuard} from "./core/Guard/admin/admin.guard";
import {ScheduleComponent} from "./Pages/admin/schedule/schedule.component";

export const routes: Routes = [
  {path: '', component: HomeComponent, title: 'Page d\'accueil'},
  {path: 'login', component: AuthentificationComponent, title: 'Connexion'},
  {path: 'register', component: RegisterComponent, title: 'Inscription'},
  {path: 'account', component: AccountComponent, title: 'Compte', canActivate: [authGuard]},
  {path: 'reservation', component: ReservationComponent, title: 'Réservation', canActivate: [authGuard]},
  {path: 'schedule', component: ScheduleComponent, title: 'Planning'},
];
