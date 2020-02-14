import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CustomerCreatePage } from './customer-create.page';

describe('CustomerCreatePage', () => {
  let component: CustomerCreatePage;
  let fixture: ComponentFixture<CustomerCreatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerCreatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
