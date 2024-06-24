import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  SERVER_URL = "http://localhost:8080"

  constructor(private http: HttpClient) {

  }

  uploadVideo(formData: FormData): Observable<any> {
    return this.http.post( this.SERVER_URL + "/api/videos/video-upload", formData, {
      reportProgress: true,
      observe: 'events'
    })  
  }
}
