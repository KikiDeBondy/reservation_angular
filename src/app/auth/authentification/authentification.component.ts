import {Component, inject, ViewChild} from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {AuthentificationService} from "../../Services/auth/authentification.service";
import {Router, RouterLink} from "@angular/router";
import {AlertModule} from "@coreui/angular";

@Component({
  selector: 'app-authentification',
  standalone: true,
  imports: [FormsModule, AlertModule, RouterLink],
  templateUrl: './authentification.component.html',
  styleUrl: './authentification.component.css'
})
export class AuthentificationComponent {

  errorMessage: string | null = null;

  @ViewChild('loginForm') loginForm!: NgForm;
  private authService = inject(AuthentificationService);
  private router = inject(Router);

  onSubmit() {
    this.authService.authentification(this.loginForm.value.username,this.loginForm.value.password)
      .subscribe({
      next: ()=>{
        this.router.navigate(['/'])
      },
      error: (err) =>{
        this.errorMessage = err.error.error
      }
    })
  }

}
