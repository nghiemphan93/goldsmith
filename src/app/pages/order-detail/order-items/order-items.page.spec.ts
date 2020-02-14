import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderItemsPage } from './order-items.page';

describe('OrderItemsPage', () => {
  let component: OrderItemsPage;
  let fixture: ComponentFixture<OrderItemsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderItemsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderItemsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
