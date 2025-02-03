import { Routes } from '@angular/router';
import {HomeComponent} from "./Pages/home/home.component";
import {AuthentificationComponent} from "./auth/authentification/authentification.component";
import {RegisterComponent} from "./auth/register/register.component";
import {AccountComponent} from "./Pages/account/account.component";

export const routes: Routes = [
  {path: '', component: HomeComponent, title: 'Page d\'accueil'},
  {path: 'login', component: AuthentificationComponent, title: 'Connexion'},
  {path: 'register', component: RegisterComponent, title: 'Inscription'},
  {path: 'account', component: AccountComponent, title: 'Compte'}
];
