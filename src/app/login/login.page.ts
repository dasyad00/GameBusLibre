import { Message } from './../services/data.service';
import { GamebusService } from './../services/gamebus-service.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { catchError } from 'rxjs/operators';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    constructor(
        private router: Router,
        private toastController: ToastController,
        private storage: Storage,
        private gamebus: GamebusService
    ) {}

    protected email: string;
    protected password: string;

    async onClick() {
        try {
            let user = await this.gamebus.login(this.email, this.password);
            await Promise.all([
                this.storage.set('token', user.token),
                this.storage.set('id', user.id),
            ]);

            let msg = 'Login successful!';
            console.log(msg);
            this.presentToast(msg);
            this.router.navigateByUrl('/home');
        } catch (e) {
            let msg = 'Invalid email and/or password';
            // let msg = e.message;
            console.log(msg);
            this.presentToast(msg);
        }
    }

    async presentToast(message) {
        const toast = await this.toastController.create({
            message,
            duration: 2000,
        });
        toast.present();
    }

    ngOnInit() {}
}
