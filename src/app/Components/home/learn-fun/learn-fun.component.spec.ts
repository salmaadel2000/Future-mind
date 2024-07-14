import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnFunComponent } from './learn-fun.component';

describe('LearnFunComponent', () => {
  let component: LearnFunComponent;
  let fixture: ComponentFixture<LearnFunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearnFunComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearnFunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
