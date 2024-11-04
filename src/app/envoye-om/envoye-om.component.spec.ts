import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvoyeOMComponent } from './envoye-om.component';

describe('EnvoyeOMComponent', () => {
  let component: EnvoyeOMComponent;
  let fixture: ComponentFixture<EnvoyeOMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvoyeOMComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnvoyeOMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
