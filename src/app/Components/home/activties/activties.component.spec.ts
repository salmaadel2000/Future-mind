import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivtiesComponent } from './activties.component';

describe('ActivtiesComponent', () => {
  let component: ActivtiesComponent;
  let fixture: ComponentFixture<ActivtiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivtiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivtiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
