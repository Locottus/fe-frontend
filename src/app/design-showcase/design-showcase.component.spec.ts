import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignShowcaseComponent } from './design-showcase.component';

describe('DesignShowcaseComponent', () => {
  let component: DesignShowcaseComponent;
  let fixture: ComponentFixture<DesignShowcaseComponent>;

  beforeEach(async) {
    await TestBed.configureTestingModule({
      declarations: [ DesignShowcaseComponent ]
    })
    .compileComponents();
  }

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
