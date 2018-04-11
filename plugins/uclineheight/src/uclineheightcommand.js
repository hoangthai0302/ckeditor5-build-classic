/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module uclineheight/uclineheightcommand
 */

import Command from '@ckeditor/ckeditor5-core/src/command';
import Range from '@ckeditor/ckeditor5-engine/src/model/range';
import toMap from '@ckeditor/ckeditor5-utils/src/tomap';

export default class UcLineHeightCommand extends Command {

    refresh() {
        const model = this.editor.model;
        const doc = model.document;

        this.lineHeight = doc.selection.getAttribute( 'lineHeight' );

        // enabled if any selection is done
        this.isEnabled = !doc.selection.isCollapsed;

        if (this.isEnabled) {
            this.isEnabled = model.schema.checkAttributeInSelection(doc.selection, 'lineHeight');
        }
    }

    execute( data ) {

        const model = this.editor.model;
        const doc = model.document;
        const selection = model.document.selection;

        model.change( writer => {
            const ranges = model.schema.getValidRanges( selection.getRanges(), 'lineHeight' );

            for ( const range of ranges ) {
                if ( parseInt(data.lineHeight) ) {
                    writer.setAttribute( 'lineHeight', data.lineHeight, range );
                } else {
                    writer.removeAttribute( 'lineHeight', range );
                }
            }
        } );
    }
}
