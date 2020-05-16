import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-reading',
  templateUrl: './reading.component.html',
  styleUrls: ['./reading.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReadingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
