import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Title, DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormGroup, FormBuilder } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { BaseViewComponent } from 'app/site/base/base-view';
import { MotionComment } from 'app/shared/models/motions/motion';
import { MotionCommentSectionRepositoryService } from 'app/core/repositories/motions/motion-comment-section-repository.service';
import { MotionPdfExportService } from 'app/site/motions/services/motion-pdf-export.service';
import { OperatorService } from 'app/core/core-services/operator.service';
import { ViewMotion } from 'app/site/motions/models/view-motion';
import { ViewMotionCommentSection } from 'app/site/motions/models/view-motion-comment-section';

/**
 * Component for the motion comments view
 */
@Component({
    selector: 'os-motion-comments',
    templateUrl: './motion-comments.component.html',
    styleUrls: ['./motion-comments.component.scss']
})
export class MotionCommentsComponent extends BaseViewComponent {
    /**
     * An array of all sections the operator can see.
     */
    public sections: ViewMotionCommentSection[] = [];

    /**
     * An object of forms for one comment mapped to the section id.
     */
    public commentForms: { [id: number]: FormGroup } = {};

    /**
     * This object holds all comments for each section for the given motion.
     */
    public comments: { [id: number]: MotionComment } = {};

    /**
     * The motion, which these comments belong to.
     */
    private _motion: ViewMotion;

    /**
     * Set to true if an error was detected to prevent automatic navigation
     */
    public error = false;

    @Input()
    public set motion(motion: ViewMotion) {
        this._motion = motion;
        this.updateComments();
    }

    public get motion(): ViewMotion {
        return this._motion;
    }

    /**
     * Watches for changes in sections and the operator. If one of them changes, the sections are reloaded
     * and the comments updated.
     *
     * @param commentRepo The repository that handles server communication
     * @param formBuilder Form builder to handle text editing
     * @param operator service to get the sections
     * @param pdfService service to export a comment section to pdf
     * @param sanitizer to sanitize the inner html text
     * @param titleService set the browser title
     * @param translate the translation service
     * @param matSnackBar showing errors and information
     */
    public constructor(
        private commentRepo: MotionCommentSectionRepositoryService,
        private formBuilder: FormBuilder,
        private operator: OperatorService,
        private pdfService: MotionPdfExportService,
        private sanitizer: DomSanitizer,
        titleService: Title,
        translate: TranslateService,
        matSnackBar: MatSnackBar
    ) {
        super(titleService, translate, matSnackBar);

        this.commentRepo.getViewModelListObservable().subscribe(sections => this.setSections(sections));
        this.operator.getUserObservable().subscribe(() => this.setSections(this.commentRepo.getViewModelList()));
    }

    /**
     * sets the `sections` member with sections, if the operator has reading permissions.
     *
     * @param allSections A list of all sections available
     */
    private setSections(allSections: ViewMotionCommentSection[]): void {
        this.sections = allSections.filter(section => this.operator.isInGroupIds(...section.read_groups_id));
        this.updateComments();
    }

    /**
     * Returns true if the operator has write permissions for the given section, so he can edit the comment.
     *
     * @param section The section to judge about
     */
    public canEditSection(section: ViewMotionCommentSection): boolean {
        return this.operator.isInGroupIds(...section.write_groups_id);
    }

    /**
     * Update the comments. Comments are saved in the `comments` object associated with their section id.
     */
    private updateComments(): void {
        this.comments = {};
        if (!this.motion || !this.sections) {
            return;
        }
        this.sections.forEach(section => {
            this.comments[section.id] = this.motion.getCommentForSection(section);
        });
    }

    /**
     * Puts the comment into edit mode.
     *
     * @param section The section for the comment.
     */
    public editComment(section: ViewMotionCommentSection): void {
        const comment = this.comments[section.id];
        const form = this.formBuilder.group({
            comment: [comment ? comment.comment : '']
        });
        this.commentForms[section.id] = form;
    }

    /**
     * Saves the comment.
     *
     * @param section The section for the comment to save
     */
    public saveComment(section: ViewMotionCommentSection): void {
        const commentText = this.commentForms[section.id].get('comment').value;
        this.commentRepo.saveComment(this.motion, section, commentText).then(
            () => {
                this.cancelEditing(section);
            },
            error => {
                this.error = true;
                this.raiseError(`${error} :"${section.name}"`);
            }
        );
    }

    /**
     * Cancles the editing for a comment.
     *
     * @param section The section for the comment
     */
    public cancelEditing(section: ViewMotionCommentSection): void {
        delete this.commentForms[section.id];
    }

    /**
     * Check if a section is visible at all
     *
     * @param section
     * @returns true if there is any content or the user is allowed to edit
     */
    public sectionVisible(section: ViewMotionCommentSection): boolean {
        if (!this.canEditSection(section) && (!this.comments[section.id] || !this.comments[section.id].comment)) {
            return false;
        }
        return true;
    }

    /**
     * Returns true, if the comment is edited.
     *
     * @param section The section for the comment.
     * @returns a boolean of the comments is edited
     */
    public isCommentEdited(section: ViewMotionCommentSection): boolean {
        return Object.keys(this.commentForms).includes('' + section.id);
    }

    /**
     * Triggers a direct pdf export of this comment
     *
     * @param section
     */
    public pdfExportSection(section: ViewMotionCommentSection): void {
        this.pdfService.exportComment(section, this.motion);
    }

    /**
     * Sanitize the text to be safe.
     *
     * @param text to be sanitized.
     *
     * @returns SafeHtml
     */
    public sanitizeText(text: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(text);
    }
}
