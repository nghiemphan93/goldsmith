import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SearchCustomerPage } from './search-customer.page';

describe('SearchCustomerPage', () => {
  let component: SearchCustomerPage;
  let fixture: ComponentFixture<SearchCustomerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchCustomerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchCustomerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
