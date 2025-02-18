import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Slot} from "../models/Slot";
import {User} from "../models/User";

@Injectable({
  providedIn: 'root'
})
export class SlotService {
  private http = inject(HttpClient);

  constructor() { }

  generateSlot(data: { barber_id: number; start_date: string | null; end_date: string | null }) {
    return this.http.post<Array<String>>('http://localhost:8000/slot/generate', data);
  }

  availibilitiesOfBarber(id: number, page: number){
    return this.http.get<Slot>(`http://localhost:8000/slot/weekly/unreserved/${id}/${page}`);
  }
  planningOfBarber(id: number, page: number){
    return this.http.get<Slot>(`http://localhost:8000/slot/weekly/${id}/${page}`);
  }

  slotUpdate(id: number, reserved: boolean){
    return this.http.put(`http://localhost:8000/slot/update/${id}`, { is_reserved: !reserved });
  }

  absenceOfBarber(id: number,data: { barber_id: number; start_date: string | null; end_date: string | null } ){
    return this.http.put(`http://localhost:8000/slot/absent/${id}`, data);
  }
}
