import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderCreatePage } from './order-create.page';

describe('OrderCreatePage', () => {
  let component: OrderCreatePage;
  let fixture: ComponentFixture<OrderCreatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderCreatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
