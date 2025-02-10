import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Reservation} from "../models/Reservation";

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private http = inject(HttpClient);

  constructor() { }

  addReservation(reservation: Reservation){
    return this.http.post<any>('http://localhost:8000/reservation/new', reservation);
  }

  showReservationByUser(id: number){
    return this.http.get<any>(`http://localhost:8000/reservationByUser/${id}`);
  }

  weeklyReservation(date: string){
    return this.http.get<any>(`http://localhost:8000/reservation/weekly/${date}`);
  }

  deleteReservation(id?: number , userId?: number){
    return this.http.delete<any>(`http://localhost:8000/reservation/delete/${id}/${userId}`);
  }
  reservation(){
    return this.http.get<any>(`http://localhost:8000/reservation`);
  }
}
