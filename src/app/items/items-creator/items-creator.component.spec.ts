import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsCreatorComponent } from './items-creator.component';

describe('ItemsCreatorComponent', () => {
  let component: ItemsCreatorComponent;
  let fixture: ComponentFixture<ItemsCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemsCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
