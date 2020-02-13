import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DemoTablePage } from './demo-table.page';

describe('DemoTablePage', () => {
  let component: DemoTablePage;
  let fixture: ComponentFixture<DemoTablePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoTablePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DemoTablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
