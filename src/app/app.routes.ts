import { Routes } from '@angular/router';
import {HomeComponent} from "./Pages/home/home.component";
import {AuthentificationComponent} from "./auth/authentification/authentification.component";

export const routes: Routes = [
  {path: '', component: HomeComponent, title: 'Page d\'accueil'},
  {path: 'login', component: AuthentificationComponent, title: 'Connexion'}
];
