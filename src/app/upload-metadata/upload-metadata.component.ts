import { FormBuilder, FormControl, FormGroup, FormsModule, NG_VALUE_ACCESSOR, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatChip } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, forwardRef, inject } from '@angular/core';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LiveAnnouncer } from '@angular/cdk/a11y';


import { NgFor, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { DataServiceService } from '../service/data-service.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { Video, VideoStatus } from '../models/video-metaData';
import { error } from 'console';


@Component({
  selector: 'app-upload-metadata',
  standalone: true,
  imports: [MatFormFieldModule, MatIconModule, MatSelectModule, MatInputModule, MatAutocomplete, NgFor, NgIf, MatChip, MatIcon, MatChipsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './upload-metadata.component.html',
  styleUrl: './upload-metadata.component.scss'
})
export class UploadMetadataComponent implements OnInit {

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  tags: string[] = [];
  thumbNailUrl: string = "";
  thumbNailUpload: boolean = true;
  metaDataUpload: boolean = false // Flag variable 
  file: File | undefined; // Variable to store file 
  videoId: string = "";
  videoMetaData: any;
  videoUrl = "";

  announcer = inject(LiveAnnouncer);
  videoFormGroup = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    tags: new FormControl(''),
    videoStatus: new FormControl(''),
  })

  constructor(
    private dataService: DataServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) {
    this.route.paramMap.subscribe((params) => {
      this.videoId = params.get('videoId')!;
      this.dataService.getVideoUrl(this.videoId).subscribe((data:any )=> {
        this.videoUrl = data;
      }, (error: Error) =>{
        console.log(error.message + "=== get videoUrl error" + error.stack)
      })
    });

  }

  ngOnInit(): void {
    this.videoFormGroup = this.formBuilder.group(
      {
        title: ['', Validators.required],
        description: ['', Validators.required],
        tags: ['', Validators.required],
        videoStatus: ['', Validators.required],
      }
    )
  }


  onChange(event: any) {
    this.file = event.target.files[0] as File;
  }

  onUpload() {
    const formData = new FormData()
    console.log("===" + this.file);
    if(this.file){
      this.spinner.show()
      formData.append("file", this.file)
      this.dataService.uploadThumbnail(formData, this.videoId).subscribe(
        (res: any) => {
          console.log("==res:" + res)
          this.spinner.hide();
          this.toastr.success("thumbnail uploaded successfully!")
          this.thumbNailUrl = res;
          this.thumbNailUpload = false;
          this.metaDataUpload = true;
        },
        (error: Error)=>{
          this.toastr.success("thumbnail upload failed!")
          console.log("error uploading thumbnail", error.message)
        }
      );
    }
    
  }


  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tags.push(value);
    }
    event.chipInput!.clear();
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
      this.announcer.announce(`Removed ${tag}`);
    }
  }

  edit(tag: string, event: MatChipEditedEvent) {
    const value = event.value.trim();
    if (!value) {
      this.remove(tag);
      return;
    }
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags[index] = value;
    }
  }

  get f() { return this.videoFormGroup.controls; }

  onUploadMetaData() {
    this.spinner.show()
    this.videoMetaData ={
      id: this.videoId,
      title: this.videoFormGroup.get('title')?.value,
      description : this.videoFormGroup.get('description')?.value,
      VideoStatus : this.videoFormGroup.get('videoStatus')?.value == "private"? "PRIVATE": "PUBLIC",
      thumbNailUrl: this.thumbNailUrl,
    }
    // this.videoMetaData.title = this.videoFormGroup.get('title')?.value;
    // this.videoMetaData.description = this.videoFormGroup.get('description')?.value;
    // this.videoMetaData.thumbNailUrl = this.thumbNailUrl;

    // this.videoMetaData = this.videoFormGroup.value

    this.dataService.uploadMetaData(this.videoMetaData).subscribe(data => {
      console.log("video update ===", data)
      this.metaDataUpload = false;
      this.spinner.hide();
      this.toastr.success("video data updated successfully!")
    }, error => {
      this.metaDataUpload = true;
      this.spinner.hide();
      console.log(error)
      this.toastr.error("video data update failed!")
    })

    console.log("=== form value: ", this.videoFormGroup.value)
  }

}

