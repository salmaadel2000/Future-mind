import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildLevelDetailsComponent } from './child-level-details.component';

describe('ChildLevelDetailsComponent', () => {
  let component: ChildLevelDetailsComponent;
  let fixture: ComponentFixture<ChildLevelDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChildLevelDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChildLevelDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
