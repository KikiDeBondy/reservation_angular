import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {BehaviorSubject, tap} from "rxjs";
import { User } from "../../models/User";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  private http = inject(HttpClient);
  private router = inject(Router);

  // Utiliser un BehaviorSubject pour stocker et émettre l'état de l'utilisateur actuel
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {}

  // Fonction pour récupérer l'utilisateur depuis le sessionStorage (si existant)
  private getUserFromStorage(): User | null {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Méthode d'authentification avec email et mot de passe
  authentification(email: string, password: string) {
    let data = { username: email, password: password };

    // Appel API pour se connecter
    return this.http.post<any>('http://localhost:8000/api/login', data).pipe(
      // En cas de succès, traiter la réponse et mettre à jour l'état de l'utilisateur
      tap((response: User) => {
        sessionStorage.setItem('user', JSON.stringify(response)); // Stocker l'utilisateur dans sessionStorage
        // res.cookie("SESSIONID", JSON.stringify(response.token), {httpOnly: true, secure: true}); // Stocker le token dans un cookie sécurisé
        this.currentUserSubject.next(response); // Mettre à jour le BehaviorSubject avec l'utilisateur connecté
      })
    );
  }

  // Méthode de déconnexion
  logout() {
    sessionStorage.clear(); // Supprimer l'utilisateur du sessionStorage
    this.currentUserSubject.next(null); // Mettre à jour l'état de l'utilisateur à null
    this.router.navigate(['/login']); // Rediriger vers la page de connexion
  }

}
