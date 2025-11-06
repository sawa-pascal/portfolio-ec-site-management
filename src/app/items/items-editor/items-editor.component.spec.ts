import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsEditorComponent } from './items-editor.component';

describe('ItemsEditorComponent', () => {
  let component: ItemsEditorComponent;
  let fixture: ComponentFixture<ItemsEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemsEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
