import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SearchOrderItemPage } from './search-order-item.page';

describe('SearchOrderItemPage', () => {
  let component: SearchOrderItemPage;
  let fixture: ComponentFixture<SearchOrderItemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchOrderItemPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchOrderItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
