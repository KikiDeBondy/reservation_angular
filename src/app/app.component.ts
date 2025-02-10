import { Component } from '@angular/core';import { ScheduleModule, RecurrenceEditorModule } from '@syncfusion/ej2-angular-schedule';

import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from "./partials/header/header.component";

@Component({
  selector: 'app-root',
  imports: [ScheduleModule, RecurrenceEditorModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'reservation';
}
