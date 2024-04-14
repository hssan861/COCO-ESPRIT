import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnnouncementCarpooling } from '../../Models/Carpooling/announcement-carpooling';
import { catchError, throwError } from 'rxjs';
import { Adress } from '../../Models/Carpooling/adress';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementCarpoolingService {

  URL = "http://localhost:9092/CarpoolingAnnouncement"
  constructor(private http:HttpClient) { }
  httpOtions = {
    headers: new HttpHeaders({
      'Content-type': 'application/json'
    })
  }

  getallPlaces(){
    return this.http.get<AnnouncementCarpooling[]>(this.URL+"/getAllAnnouncementCarpoolingPlaces");
  }

  getAnnCarpoolingById(id:number){
    return this.http.get<AnnouncementCarpooling>(`${this.URL+"/getByIdAnnouncementCarpooling"}/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching user by ID:', error);
        return throwError(error);
      })
    );
  }
  AddAnnCarpooling( annCarpooling: AnnouncementCarpooling) {
    return this.http.post<AnnouncementCarpooling>(this.URL+"/addAnnCarpooling", annCarpooling,this.httpOtions)
  }


}
