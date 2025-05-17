import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { videoResponse } from '../models/video-response';
import { text } from 'stream/consumers';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  SERVER_URL = "http://localhost:8080"

  constructor(private http: HttpClient) {

  }

  uploadVideo(formData: FormData): Observable<any> {
    return this.http.post<any>(this.SERVER_URL + "/api/videos/upload-video", formData
      //   , {
      //   reportProgress: true,
      //   observe: 'events'
      // }
    )
  }
  uploadThumbnail(formData: FormData, videoId: string): Observable<any> {
    return this.http.post(this.SERVER_URL + "/api/videos/upload-thumbnail", formData,
      {
        responseType: "text",
        params: {
          videoId: videoId
        },
      }
    )
  }

  uploadMetaData(videoMetaData: any): Observable<string> {
    return this.http.put<string>(this.SERVER_URL + "/api/videos/video-metadata", videoMetaData)
  }

  getVideoUrl(id: string): Observable<any> {
    const headers = new HttpHeaders({ 'Accept': 'text/plain', 'Content-Type': 'text/plain' });
    return this.http.get(this.SERVER_URL + "/api/videos/video-details",
     {
      headers: headers,
      responseType: "text",
      params: {
        videoId: id
      },
    }
    )

  }
}
