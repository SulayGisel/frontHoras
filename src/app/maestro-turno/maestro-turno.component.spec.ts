import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaestroTurnoComponent } from './maestro-turno.component';

describe('MaestroTurnoComponent', () => {
  let component: MaestroTurnoComponent;
  let fixture: ComponentFixture<MaestroTurnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaestroTurnoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaestroTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
