/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module ucvideo/ucvideocommand
 */

import Command from '@ckeditor/ckeditor5-core/src/command';
import Range from '@ckeditor/ckeditor5-engine/src/model/range';
import toMap from '@ckeditor/ckeditor5-utils/src/tomap';

export default class UcVideoCommand extends Command {

    refresh() {
        const model = this.editor.model;
        const doc = model.document;

        // enabled if any selection is done
        this.isEnabled = doc.selection.isCollapsed;
    }

    execute( data ) {

        const model = this.editor.model;
        const doc = model.document;
        const selection = model.document.selection;

        model.change( writer => {
            const ranges = model.schema.getValidRanges( selection.getRanges(), 'ucVideo' );

        } );
    }
}
