import { TestBed } from '@angular/core/testing';

import { LayoutRemoteService } from './layout-remote.service';

describe('LayoutService', () => {
  let service: LayoutRemoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayoutRemoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
