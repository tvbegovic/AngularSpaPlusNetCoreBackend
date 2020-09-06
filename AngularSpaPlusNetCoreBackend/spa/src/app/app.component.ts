import { Component, EventEmitter } from '@angular/core';
import { UploadInput, UploadOutput, UploaderOptions } from 'ngx-uploader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'testapp';

  uploaderOptions: UploaderOptions = {concurrency: 3};
  uploadInput = new EventEmitter<UploadInput>();
  tempUploadedFiles = {};
  files: string[] = [];

  onUploadOutput(output: UploadOutput) : void {
    
    if (output.type === 'allAddedToQueue') { // when all files added in queue
      // uncomment this if you want to auto upload files when added
      for(const fileId in this.tempUploadedFiles) {
        const event: UploadInput = {
          type: 'uploadFile',
          url: `/api/uploadFile?id=${this.tempUploadedFiles[fileId].id}`,
          file: this.tempUploadedFiles[fileId],
          method: 'POST'
        };

        this.uploadInput.emit(event);        
      }

    } else if (output.type === 'addedToQueue'  && typeof output.file !== 'undefined') { // add file to array when added
      this.tempUploadedFiles[output.file.id] = output.file;      
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      // update current data in files array for uploading file
      this.tempUploadedFiles[output.file.id] = output.file;      
    } else if (output.type === 'done') {

      //TODO: ovdje se ubacuje kod kojim se uploadani fajl doda u kolekciju koja se onda može renderirati (preview)
      //Zasad samo ispisujem ime fajla
      this.files.push(output.file.name);
    }
    
  }
}
