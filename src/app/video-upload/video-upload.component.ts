import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataServiceService } from '../service/data-service.service';
import { HttpEventType } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgFor, NgIf } from '@angular/common';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-video-upload',
  standalone: true,
  imports: [MatIconModule, MatProgressBarModule, NgIf, NgFor, NgxFileDropModule],
  templateUrl: './video-upload.component.html',
  styleUrl: './video-upload.component.scss'
})
export class VideoUploadComponent {

  url = '';
  uploadProgress: number = 0;
  uploadSub: Subscription = new Subscription;

  constructor(private dataService: DataServiceService, private spinner: NgxSpinnerService) { }

  // onFileSelected(event: any) {
  //   const file: File = event.target.files[0];


  //   if (file) {
  //     this.fileName = file.name;
  //     const formData = new FormData();
  //     formData.append("file", file);
  //     this.uploadSub = this.dataService.uploadVideo(formData).subscribe((event:any) => {
  //       if (event.type == HttpEventType.UploadProgress) {
  //         this.uploadProgress = Math.round(100 * (event.loaded / event.total));
  //         console.log("=======", this.uploadProgress)
  //       }
  //     },(error)=>{
  //       console.log("error loading data..."+ error)
  //     },()=>{
  //       this.reset();
  //     })

  //   }
  // }

  // cancelUpload() {
  //   this.uploadSub?.unsubscribe();
  //   this.reset();
  // }

  reset() {
    this.uploadProgress = 0;
    // this.uploadSub = null;
  }


  public files: NgxFileDropEntry[] = [];
  public file: any;

  uploadVideo() {
    this.spinner.show()
    const formData = new FormData()
    if(this.file){
      console.log("===================", this.file);
      formData.append("file", this.file)
      this.uploadSub = this.dataService.uploadVideo(formData).subscribe((event: any) => {
      if (event.type == HttpEventType.UploadProgress) {
        this.uploadProgress = Math.round(100 * (event.loaded / event.total));
        console.log("=======", this.uploadProgress)
      }
    }, (error) => {
      this.spinner.hide();
      console.log("error loading data..." + error)
    }, () => {
      this.spinner.hide();
      this.reset();
    })
    }
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


