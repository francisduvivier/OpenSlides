import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotionDetailComponent } from './motion-detail.component';
import { E2EImportsModule } from 'e2e-imports.module';
import { MotionCommentsComponent } from '../motion-comments/motion-comments.component';
import { PersonalNoteComponent } from '../personal-note/personal-note.component';
import { ManageSubmittersComponent } from '../manage-submitters/manage-submitters.component';
import { MotionPollComponent } from '../motion-poll/motion-poll.component';
import { MotionDetailOriginalChangeRecommendationsComponent } from '../motion-detail-original-change-recommendations/motion-detail-original-change-recommendations.component';
import { MotionDetailDiffComponent } from '../motion-detail-diff/motion-detail-diff.component';

describe('MotionDetailComponent', () => {
    let component: MotionDetailComponent;
    let fixture: ComponentFixture<MotionDetailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [E2EImportsModule],
            declarations: [
                MotionDetailComponent,
                MotionCommentsComponent,
                PersonalNoteComponent,
                ManageSubmittersComponent,
                MotionPollComponent,
                MotionDetailOriginalChangeRecommendationsComponent,
                MotionDetailDiffComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MotionDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
