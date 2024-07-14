import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentDasboardComponent } from './parent-dasboard.component';

describe('ParentDasboardComponent', () => {
  let component: ParentDasboardComponent;
  let fixture: ComponentFixture<ParentDasboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParentDasboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParentDasboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
