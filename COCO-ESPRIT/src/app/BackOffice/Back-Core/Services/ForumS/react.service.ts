import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ReactPost } from '../../Models/Forum/ReactPost';

@Injectable({
    providedIn: 'root'
  })
  export class ReactService {
    private _refresh$ = new Subject<void>();
    private piURL = "http://localhost:9092/COCO" ;
     constructor(private http: HttpClient) { }


     addReacttoPost(id: number,react: ReactPost) : Observable<any>{
        return this.http.post(`http://localhost:9092/COCO/addReacttoPost/${id}`, react);
      
      }
      retrieveAllReactPost(): Observable<ReactPost[]> {
        return this.http.get<ReactPost[]>(`http://localhost:9092/COCO/retrieveAllReactPost`);
      }

      getReactsForPost(postId: number): Observable<ReactPost[]> {
        return this.http.get<ReactPost[]>(`http://localhost:9092/COCO/getReactsForPost/${postId}`);
      }
      
  }