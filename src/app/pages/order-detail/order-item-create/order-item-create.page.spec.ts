import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderItemCreatePage } from './order-item-create.page';

describe('OrderItemCreatePage', () => {
  let component: OrderItemCreatePage;
  let fixture: ComponentFixture<OrderItemCreatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderItemCreatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderItemCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
