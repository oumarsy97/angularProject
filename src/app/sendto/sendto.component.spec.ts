import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendtoComponent } from './sendto.component';

describe('SendtoComponent', () => {
  let component: SendtoComponent;
  let fixture: ComponentFixture<SendtoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendtoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendtoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
