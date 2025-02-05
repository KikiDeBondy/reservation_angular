export type Reservation= {
    id?: number;
    title: string;
    start: string;
    end: string;
    client_id: number;
    barber_id: number;
    client?: any;
    barber?: any;
}
