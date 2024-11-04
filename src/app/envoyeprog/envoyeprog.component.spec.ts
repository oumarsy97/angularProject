import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvoyeprogComponent } from './envoyeprog.component';

describe('EnvoyeprogComponent', () => {
  let component: EnvoyeprogComponent;
  let fixture: ComponentFixture<EnvoyeprogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvoyeprogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnvoyeprogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
