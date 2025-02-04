import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {AuthentificationService} from "../../Services/auth/authentification.service";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    CommonModule
  ],
  templateUrl: './register.component.html',
  standalone: true,
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  private authService = inject(AuthentificationService);
  private router = inject(Router);
  formRegister: FormGroup= new FormGroup({
    name: new FormControl('', Validators.required),
    forename: new FormControl('', Validators.required),
    number: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),

  });

  onSubmit() {
    this.authService.registration(this.formRegister.value).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
}
