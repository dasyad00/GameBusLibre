import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DownloadCsvPage } from './download-csv.page';

describe('DownloadCsvPage', () => {
  let component: DownloadCsvPage;
  let fixture: ComponentFixture<DownloadCsvPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadCsvPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DownloadCsvPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
