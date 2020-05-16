import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DownloadCsvPageRoutingModule } from './download-csv-routing.module';

import { DownloadCsvPage } from './download-csv.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DownloadCsvPageRoutingModule
  ],
  declarations: [DownloadCsvPage]
})
export class DownloadCsvPageModule {}
