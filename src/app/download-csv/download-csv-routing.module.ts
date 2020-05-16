import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DownloadCsvPage } from './download-csv.page';

const routes: Routes = [
  {
    path: '',
    component: DownloadCsvPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DownloadCsvPageRoutingModule {}
