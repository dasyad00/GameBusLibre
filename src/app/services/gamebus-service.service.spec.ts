import { TestBed } from '@angular/core/testing';

import { GamebusService } from './gamebus-service.service';

describe('GamebusServiceService', () => {
  let service: GamebusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GamebusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
