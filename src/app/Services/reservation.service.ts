import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Reservation} from "../models/Reservation";
import {apiUrl} from "../environment/local";

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private http = inject(HttpClient);

  constructor() { }

  addReservation(reservation: Reservation){
    return this.http.post<any>(apiUrl+'/reservation/new', reservation);
  }

  showReservationByUser(id: number){
    return this.http.get<any>(apiUrl+`/reservationByUser/${id}`);
  }

  weeklyReservation(date: string){
    return this.http.get<any>(apiUrl+`/reservation/weekly/${date}`);
  }

  deleteReservation(id?: number , userId?: number){
    return this.http.delete<any>(apiUrl+`/reservation/delete/${id}/${userId}`);
  }
  reservation(){
    return this.http.get<any>(apiUrl+`/reservation`);
  }
  nextReservation(id: number){
    return this.http.get<any>(apiUrl+`/reservation/next/${id}`);
  }
}
