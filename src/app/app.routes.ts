import { Routes } from '@angular/router';
import { VideoUploadComponent } from './video-upload/video-upload.component';
import { UploadMetadataComponent } from './upload-metadata/upload-metadata.component';

export const routes: Routes = [
    { path: '', redirectTo: 'upload-videos', pathMatch: 'full'},
    { path: 'upload-video', component: VideoUploadComponent },
    { path: 'upload-videos/:videoId',  component: UploadMetadataComponent},
];
