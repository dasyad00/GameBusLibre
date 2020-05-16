import { Activity, Glucose } from './../gamebus-data/gamebus-data.enum';
import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { GamebusService } from '../services/gamebus-service.service';
import { ActivityObject } from '../models/activityobject';

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
        private router: Router,
        private storage: Storage,
        private gamebus: GamebusService
    ) {}

    ngOnInit() {}

    onLibreViewLoad() {
        console.log('i am loaded');
    }

    async onUpload(event: Event) {
        console.log(event);
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

        let list = await this.gamebus.getActivityList();
        let latestGlucoseActivity = list.filter((value) => {
            return value.gameDescriptor.id === Activity.GLUCOSE;
        })[0];
        console.log('activity-date:' + latestGlucoseActivity.date);

        console.log(latestGlucoseActivity);
        const newData = data.filter((activity) => {
            return (
                activity.timestamp > latestGlucoseActivity.getDate()
            );
        });
        newData.forEach((activity) => {
            this.gamebus
                .submitGlucoseActivity(
                    activity.timestamp,
                    Glucose.MMOL,
                    +activity.glucose
                )
                .then((v) => console.log(v));
        });

        console.log(newData);
        // .subscribe(
        //   value => {
        //     console.log(value)
        //   },
        //   (e) => {
        //     console.log(e.message)
        //   })
    }

    shwAtt(strPath) {
        const varExt = strPath.split('.');
        // alert(varExt.length);
        if (varExt[varExt.length - 1] === 'txt') {
            window.open(strPath);
        } else {
            let iframe;
            iframe = document.getElementById('libreview-frame');
            if (iframe == null) {
                iframe = document.createElement('iframe');
                iframe.id = 'hiddenDownloader';
                iframe.style.visibility = 'hidden';
                document.body.appendChild(iframe);
            }
            iframe.src = strPath;
        }
        return false;
    }
}
