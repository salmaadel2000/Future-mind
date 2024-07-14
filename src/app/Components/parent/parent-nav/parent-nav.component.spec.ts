import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentNavComponent } from './parent-nav.component';

describe('ParentNavComponent', () => {
  let component: ParentNavComponent;
  let fixture: ComponentFixture<ParentNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParentNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParentNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
