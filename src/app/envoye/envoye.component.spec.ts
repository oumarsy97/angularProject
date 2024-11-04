import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvoyeComponent } from './envoye.component';

describe('EnvoyeComponent', () => {
  let component: EnvoyeComponent;
  let fixture: ComponentFixture<EnvoyeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvoyeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnvoyeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
