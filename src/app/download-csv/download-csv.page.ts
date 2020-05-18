import { Activity, Glucose } from './../gamebus-data/gamebus-data.enum';
import { Component, OnInit, Input } from '@angular/core';
import { GamebusService } from '../services/gamebus-service.service';
import { ToastController } from '@ionic/angular';

enum columns {
    'Device',
    'Serial Number',
    'Device Timestamp',
    'Record Type',
    'Historic Glucose mmol/L',
    'Scan Glucose mmol/L',
    'Non-numeric Rapid-Acting Insulin',
    'Rapid-Acting Insulin (units)',
    'Non-numeric Food',
    'Carbohydrates (grams)',
    'Carbohydrates (servings)',
    'Non-numeric Long-Acting Insulin',
    'Long-Acting Insulin (units)',
    'Notes',
    'Strip Glucose mmol/L',
    'Ketone mmol/L',
    'Meal Insulin (units)',
    'Correction Insulin (units)',
    'User Change Insulin (units)',
}

@Component({
    selector: 'app-download-csv',
    templateUrl: './download-csv.page.html',
    styleUrls: ['./download-csv.page.scss'],
})
export class DownloadCsvPage implements OnInit {
    constructor(
        private toastController: ToastController,
        private gamebus: GamebusService
    ) {}

    showTutorial = false;
    showLibreView = false;

    ngOnInit() {}

    onLibreViewLoad() {
        document.getElementById('libreview-frame');
    }

    toggleTutorial() {
        this.showTutorial = !this.showTutorial;
    }

    openLibreView() {
        window.open('https://www.libreview.com/glucosereports', '_blank');
    }

    toggleLibreView() {
        this.showLibreView = !this.showLibreView;
    }

    async onUpload(event: Event) {
        const file = (event.target as HTMLInputElement).files[0];
        const data = (await file.text())
            .split('\n') // Split each row
            .map((line) => line.split(',')) // Split each column
            .filter((line) => line[columns['Record Type']] === '0') // Filter wanted rows
            .map((line) => {
                return {
                    timestamp: new Date(line[columns['Device Timestamp']]),
                    glucose: line[columns['Historic Glucose mmol/L']],
                };
            });

        const list = await this.gamebus.getActivityList();
        const latestGlucoseActivity = list.filter((value) => {
            return value.gameDescriptor.id === Activity.GLUCOSE;
        })[0];

        const newData = data.filter((activity) => {
            return activity.timestamp > latestGlucoseActivity.getDate();
        });

        const dataLength = newData.length;
        let msg = '';
        if (dataLength === 0) {
            msg = 'No new readings are uploaded';
        } else {
            newData.forEach((activity) => {
                this.gamebus
                    .submitGlucoseActivity(
                        activity.timestamp,
                        Glucose.MMOL,
                        +activity.glucose
                    )
                    .then((v) => console.log(v));
            });
            msg = `${await dataLength} new readings have been uploaded`;
        }
        this.presentToast(msg);
    }

    async presentToast(message) {
        const toast = await this.toastController.create({
            message,
            duration: 2000,
        });
        toast.present();
    }
}
