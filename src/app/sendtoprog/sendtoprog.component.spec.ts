import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendtoprogComponent } from './sendtoprog.component';

describe('SendtoprogComponent', () => {
  let component: SendtoprogComponent;
  let fixture: ComponentFixture<SendtoprogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendtoprogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendtoprogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
