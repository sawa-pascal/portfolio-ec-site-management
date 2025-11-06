import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersCreatorComponent } from './users-creator.component';

describe('UsersCreatorComponent', () => {
  let component: UsersCreatorComponent;
  let fixture: ComponentFixture<UsersCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
