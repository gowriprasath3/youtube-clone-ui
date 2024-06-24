import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataServiceService } from '../service/data-service.service';
import { HttpEventType } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-video-upload',
  standalone: true,
  imports: [MatIconModule, MatProgressBarModule, NgIf],
  templateUrl: './video-upload.component.html',
  styleUrl: './video-upload.component.scss'
})
export class VideoUploadComponent {

  @Input()
  requiredFileType!: string;

  fileName = '';
  uploadProgress: number | null = 0;
  uploadSub: Subscription | null = new Subscription;

  constructor(private dataService: DataServiceService) { }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append("file", file);
      this.uploadSub = this.dataService.uploadVideo(formData).subscribe((event:any) => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * (event.loaded / event.total));
        }
      },(error)=>{
        console.log("error loading data..."+ error)
      },()=>{
        this.reset();
      })

    }
  }

  cancelUpload() {
    this.uploadSub?.unsubscribe();
    this.reset();
  }

  reset() {
    this.uploadProgress = 0;
    this.uploadSub = null;
  }

}


