import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FileUploadDemoPage } from './file-upload-demo.page';

describe('FileUploadDemoPage', () => {
  let component: FileUploadDemoPage;
  let fixture: ComponentFixture<FileUploadDemoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileUploadDemoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FileUploadDemoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
