import {Component, inject, ViewChild} from '@angular/core';
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {AuthentificationService} from "../../Services/auth/authentification.service";

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  standalone: true,
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  private authService = inject(AuthentificationService);
  private router = inject(Router);
  @ViewChild('registerForm') registerForm!: NgForm;

  onSubmit() {
    console.log(this.registerForm.value);
    // this.authService.registration(this.registerForm.value).subscribe({
    //
    // })
  }
}
