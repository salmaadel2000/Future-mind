import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildActvitiesComponent } from './child-actvities.component';

describe('ChildActvitiesComponent', () => {
  let component: ChildActvitiesComponent;
  let fixture: ComponentFixture<ChildActvitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChildActvitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChildActvitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
