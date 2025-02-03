import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthentificationService} from "../../Services/auth/authentification.service";
import {Router, RouterLink} from "@angular/router";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-authentification',
  standalone: true,
  imports: [FormsModule, RouterLink, ReactiveFormsModule, ],
  templateUrl: './authentification.component.html',
  styleUrl: './authentification.component.css',
})
export class AuthentificationComponent {


  private authService = inject(AuthentificationService);
  private router = inject(Router);

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  onSubmit() {
    this.authService.authentification(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/']); // Navigue vers un tableau de bord ou une page protégée
      },
      error: (err) => {
        console.error(err);
        // Afficher l'alerte avec SweetAlert2
        Swal.fire({
          icon: 'error',
          title: 'Erreur de connexion',
          text: err.error.message || 'Identifiants invalides.',
          confirmButtonText: 'OK'
        });
      }
    });
  }

}
