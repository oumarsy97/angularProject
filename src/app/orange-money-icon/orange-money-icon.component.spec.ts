import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrangeMoneyIconComponent } from './orange-money-icon.component';

describe('OrangeMoneyIconComponent', () => {
  let component: OrangeMoneyIconComponent;
  let fixture: ComponentFixture<OrangeMoneyIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrangeMoneyIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrangeMoneyIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
