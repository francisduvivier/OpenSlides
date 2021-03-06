import { Injectable } from '@angular/core';

import { BaseSortListService, OsSortingDefinition } from 'app/core/ui-services/base-sort-list.service';
import { ViewAssignment } from '../models/view-assignment';

@Injectable({
    providedIn: 'root'
})
export class AssignmentSortListService extends BaseSortListService<ViewAssignment> {
    public sortOptions: OsSortingDefinition<ViewAssignment> = {
        sortProperty: 'assignment',
        sortAscending: true,
        options: [
            { property: 'assignment', label: 'Name' },
            { property: 'phase', label: 'Phase' },
            { property: 'candidateAmount', label: 'Number of candidates' }
        ]
    };
    protected name = 'Assignment';
}
