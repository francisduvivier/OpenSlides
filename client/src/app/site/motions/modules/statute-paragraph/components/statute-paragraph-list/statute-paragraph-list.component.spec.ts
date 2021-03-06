import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatuteParagraphListComponent } from './statute-paragraph-list.component';
import { E2EImportsModule } from 'e2e-imports.module';

describe('StatuteParagraphListComponent', () => {
    let component: StatuteParagraphListComponent;
    let fixture: ComponentFixture<StatuteParagraphListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [E2EImportsModule],
            declarations: [StatuteParagraphListComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StatuteParagraphListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
