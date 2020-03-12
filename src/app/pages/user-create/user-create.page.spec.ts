import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserCreatePage } from './user-create.page';

describe('UserCreatePage', () => {
  let component: UserCreatePage;
  let fixture: ComponentFixture<UserCreatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCreatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
