import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecepteurComponent } from './recepteur.component';

describe('RecepteurComponent', () => {
  let component: RecepteurComponent;
  let fixture: ComponentFixture<RecepteurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecepteurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecepteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
