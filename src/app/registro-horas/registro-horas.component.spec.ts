import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroHorasComponent } from './registro-horas.component';

describe('RegistroHorasComponent', () => {
  let component: RegistroHorasComponent;
  let fixture: ComponentFixture<RegistroHorasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroHorasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistroHorasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
