import { Activity, Walk, Glucose } from './../gamebus-data/gamebus-data.enum';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage';
import { UserData } from '../models/user-data';
import { map } from 'rxjs/operators';
import { ActivityObject } from '../models/activityobject';

@Injectable({
    providedIn: 'root',
})
export class GamebusService {
    constructor(
        private http: HttpClient,
        private storage: Storage
    ) {}

    private urlLogin = environment.gamebusApi + 'v2/oauth/token';
    private urlPostActivity =
        environment.gamebusApi +
        'v2/activities?dryrun=false&fields=personalPoints.value';
    private async urlGetActivity(): Promise<string> {
        return (
            environment.gamebusApi +
            'v2/players/' +
            (await this.storage.get('id')) +
            '/activities'
        );
    }

    login(username: string, password: string) {
        const str = `grant_type=password&username=${username}&password=${password}`;
        return this.http
            .post<UserData>(this.urlLogin, str, {
                headers: {
                    Authorization:
                        'Basic Z2FtZWJ1c19iYXNlX2FwcDppdkFxTFNSSnBRaDJ4QzE4OVYySEFvblVXWmd4UnVZQg==',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            })
            .pipe(map((val) => Object.assign(new UserData(), val)))
            .toPromise();
    }

    async getActivityList() {
        const date = new Date();
        const day = date.getDate().toString().padStart(2, '0');
        const mon = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return this.http
            .get<Array<ActivityObject>>(await this.urlGetActivity(), {
                headers: {
                    Authorization: `Bearer ${await this.storage.get('token')}`,
                    'Content-Type': 'text/plain',
                },
                params: {
                    limit: '100',
                    end: `${day}-${mon}-${year}`,
                    sort: '-date',
                },
            })
            .pipe(
                map((list) => {
                    // TODO fix map sometimes doesn't work
                    console.log(list);
                    return list.map((value) => {
                        let res = Object.assign(new ActivityObject(), value);
                        console.log(typeof res);
                        return res;
                    })
                })
            )
            .toPromise<Array<ActivityObject>>();
    }

    async postGamebus(
        activityID: Activity,
        date: Date,
        properties: Array<{ property: number; value: string }>
    ) {
        console.log('posting...');
        let body = {
            gameDescriptor: activityID,
            dataProvider: 1,
            date: date.getTime(),
            propertyInstances: properties,
            players: [await this.storage.get('id')],
        };
        let form = new FormData();
        form.append('activity', JSON.stringify(body));
        return this.http
            .post(this.urlPostActivity, form, {
                headers: {
                    Authorization:
                        'Bearer ' + (await this.storage.get('token')),
                },
            })
            .toPromise();
    }

    submitWalkActivity(
        date: Date,
        steps: number,
        distance: number,
        duration: number,
        kilocal: number
    ) {
        return this.postGamebus(Activity.WALK, date, [
            { property: Walk.DISTANCE, value: distance.toString() },
            { property: Walk.STEPS, value: steps.toString() },
            { property: Walk.DURATION, value: duration.toString() },
            { property: Walk.KILOCAL, value: kilocal.toString() },
        ]);
    }

    submitGlucoseActivity(
        date: Date,
        readingUnits: Glucose,
        readingValue: number
    ) {
        console.log('submitting glucose...');
        return this.postGamebus(Activity.GLUCOSE, date, [
            { property: Glucose.TIME, value: date.toISOString() },
            { property: readingUnits, value: readingValue.toString() },
        ]);
    }
}
