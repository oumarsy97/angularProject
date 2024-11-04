import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringTransfetListComponent } from './recurring-transfet-list.component';

describe('RecurringTransfetListComponent', () => {
  let component: RecurringTransfetListComponent;
  let fixture: ComponentFixture<RecurringTransfetListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecurringTransfetListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecurringTransfetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
