import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactOMComponent } from './contact-om.component';

describe('ContactOMComponent', () => {
  let component: ContactOMComponent;
  let fixture: ComponentFixture<ContactOMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactOMComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactOMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
