import {Component, Inject, inject} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {DatePipe, NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {Button} from "primeng/button";
import {AlertService} from "../../../Services/alert/alert.service";

@Component({
  selector: 'app-date-picker',
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, MatDialogModule, ReactiveFormsModule, NgIf, MatButton, Button],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css'
})
export class DatePickerComponent {
  private readonly datePipe = inject(DatePipe);
  private readonly alert = inject(AlertService);

  constructor(
    private dialogRef: MatDialogRef<DatePickerComponent>,
    @Inject(MAT_DIALOG_DATA) public data : {name : string}
  ) {}

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  onSubmit() {
    if (this.range.valid && this.range.value.start && this.range.value.end) {
      const start = this.datePipe.transform(this.range.value.start, 'yyyy-MM-dd');
      const end = this.datePipe.transform(this.range.value.end, 'yyyy-MM-dd');
      const dates = {
        start: start,
        end: end,
      }
      this.dialogRef.close(dates);
    } else {
      this.alert.errorAlert('Dates invalides ou incohérentes', 'Veuillez saisir les dates, et dans le bon ordre')

    }
  }

}
