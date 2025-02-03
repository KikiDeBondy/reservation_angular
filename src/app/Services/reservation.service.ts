import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private http = inject(HttpClient);

  constructor() { }

  showReservationByUser(id: number){
    return this.http.get<any>(`http://localhost:8000/reservationByUser/${id}`);
  }
}
