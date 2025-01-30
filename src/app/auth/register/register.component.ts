import {Component, inject, ViewChild} from '@angular/core';
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {AuthentificationService} from "../../Services/auth/authentification.service";
import {AlertComponent} from "@coreui/angular";

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    AlertComponent
  ],
  templateUrl: './register.component.html',
  standalone: true,
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  errorMessage: string | null = null;

  private authService = inject(AuthentificationService);
  private router = inject(Router);
  @ViewChild('registerForm') registerForm!: NgForm;

  onSubmit() {
    console.log(this.registerForm.value);
    this.authService.registration(this.registerForm.value).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.error.error
      }
    })
  }
}
