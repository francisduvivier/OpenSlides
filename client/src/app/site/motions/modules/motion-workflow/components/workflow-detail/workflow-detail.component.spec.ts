import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowDetailComponent } from './workflow-detail.component';
import { E2EImportsModule } from 'e2e-imports.module';

describe('WorkflowDetailComponent', () => {
    let component: WorkflowDetailComponent;
    let fixture: ComponentFixture<WorkflowDetailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [E2EImportsModule],
            declarations: [WorkflowDetailComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WorkflowDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
