/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module uccolor/uccolorcommand
 */

import Command from '@ckeditor/ckeditor5-core/src/command';
import Range from '@ckeditor/ckeditor5-engine/src/model/range';
import findUcColorRange from './finduccolorrange';
import toMap from '@ckeditor/ckeditor5-utils/src/tomap';

export default class UcColorCommand extends Command {

    refresh() {
        const model = this.editor.model;
        const doc = model.document;

        this.textColor = doc.selection.getAttribute( 'textColor' );

        // enabled if any selection is done
        this.isEnabled = !doc.selection.isCollapsed;

        if (this.isEnabled) {
            this.isEnabled = model.schema.checkAttributeInSelection(doc.selection, 'textColor');
        }
    }

    execute( data ) {

        const model = this.editor.model;
        const doc = model.document;
        const selection = model.document.selection;

        model.change( writer => {
            const ranges = model.schema.getValidRanges( selection.getRanges(), 'textColor' );

            for ( const range of ranges ) {
                writer.setAttribute( 'textColor', data.textColor, range );
            }
        } );
    }
}
