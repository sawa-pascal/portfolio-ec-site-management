import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesCreatorComponent } from './categories-creator.component';

describe('CategoriesCreatorComponent', () => {
  let component: CategoriesCreatorComponent;
  let fixture: ComponentFixture<CategoriesCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriesCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
