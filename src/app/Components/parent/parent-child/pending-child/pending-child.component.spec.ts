import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingChildComponent } from './pending-child.component';

describe('PendingChildComponent', () => {
  let component: PendingChildComponent;
  let fixture: ComponentFixture<PendingChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingChildComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
