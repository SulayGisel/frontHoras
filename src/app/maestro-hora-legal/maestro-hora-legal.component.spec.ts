import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaestroHoraLegalComponent } from './maestro-hora-legal.component';

describe('MaestroHoraLegalComponent', () => {
  let component: MaestroHoraLegalComponent;
  let fixture: ComponentFixture<MaestroHoraLegalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaestroHoraLegalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaestroHoraLegalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
