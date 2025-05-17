import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataServiceService } from '../service/data-service.service';
import { HttpEventType } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgFor, NgIf } from '@angular/common';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-video-upload',
  standalone: true,
  imports: [MatIconModule, MatProgressBarModule, NgIf, NgFor, NgxFileDropModule, NgxSpinnerModule],
  templateUrl: './video-upload.component.html',
  styleUrl: './video-upload.component.scss'
})
export class VideoUploadComponent {

  url = '';
  uploadProgress: number = 0;
  uploadSub: Subscription = new Subscription;

  constructor(private dataService: DataServiceService, private spinner: NgxSpinnerService,
    private toastrService: ToastrService, private route: Router
  ) { }

  public files: NgxFileDropEntry[] = [];
  public file: any;
  public videoId: string= "empty";

  uploadVideo() {
    const formData = new FormData()
    if (this.file) {
      this.spinner.show()
      formData.append("file", this.file)
      this.uploadSub = this.dataService.uploadVideo(formData).subscribe(data => {
        // if (data.type == HttpEventType.UploadProgress) {
        //   this.uploadProgress = Math.round(100 * (data.loaded / data.total));
        // }
        this.spinner.hide();
        this.toastrService.success("video uploaded successfully!")
        this.reset();
        this.route.navigate(['/upload-video', data.videoId])
        //667f02cf8fafe46ad3fa1ace
      }, (error) => {
        this.spinner.hide();
        this.toastrService.error("something went wrong, video upload failed!")
        console.log("error loading data..." + error)
      }
      // , () => {
      //   this.spinner.hide();
      //   this.toastrService.success("video uploaded successfully!")
      //   this.reset();
      //   this.route.navigate(['/upload-video', this.videoId])
      // }
    )
    }
  }
  
  reset() {
    this.uploadProgress = 0;
  }

  public dropped(files: NgxFileDropEntry[]) {
    files.entries.toString
    this.files = files;
    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.url = URL.createObjectURL(file);
          // Here you can access the real file
          this.file = file;
          console.log(droppedFile.relativePath, file);
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public fileOver(event: any) {
    console.log(event);
  }

  public fileLeave(event: any) {
    console.log(event);
  }

}


