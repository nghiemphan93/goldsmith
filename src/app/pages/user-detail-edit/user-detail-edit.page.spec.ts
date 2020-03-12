import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserDetailEditPage } from './user-detail-edit.page';

describe('UserDetailEditPage', () => {
  let component: UserDetailEditPage;
  let fixture: ComponentFixture<UserDetailEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDetailEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
