import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { DataService, Message } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(
    private storage: Storage,
    private router: Router,
    private data: DataService,
  ) {
  }

  refresh(ev) {
    setTimeout(() => {
      ev.detail.complete();
    }, 3000);
  }

  getMessages(): Message[] {
    return this.data.getMessages();
  }

  getCsv() {
    console.log('getting csv')
    this.router.navigateByUrl('/download-csv')
  }
  
  logOut() {
    this.storage.remove('id')
    this.storage.remove('token')
    this.router.navigateByUrl('/login')
  }

}
