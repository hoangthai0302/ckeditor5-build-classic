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
        this.isEnabled = true;

        if (doc.selection.isCollapsed) {
            // Take the first parent from selection
            const parent = Array.from( doc.selection.getSelectedBlocks() )[ 0 ];

            this.value = parent.getAttribute( 'blockTextColor' );
        } else {
            this.value = doc.selection.getAttribute( 'textColor' );
        }
    }

    execute( options = {} ) {
        const model = this.editor.model;
        const document = model.document;
        const selection = document.selection;

        // Take the color from options.value.
        const color = options.value;

        model.change( writer => {
            // Selection is collapsed - work on selection parent.
            if ( selection.isCollapsed ) {
                // Take the first parent from selection
                const parent = Array.from( selection.getSelectedBlocks() )[ 0 ];

                // If color is passed - set the attribute. Remove otherwise.
                if ( color ) {
                    writer.setAttribute( 'blockTextColor', color, parent );
                } else {
                    writer.removeAttribute( 'blockTextColor', parent );
                }
            }
            // Selection is not collapsed - work on selected text.
            else {

                // Get ranges on which 'textColor' attribute can be set.
                const ranges = model.schema.getValidRanges(
                    selection.getRanges(),
                    'textColor'
                );

                for ( const range of ranges ) {
                    const shouldUseBlock = range.isFlat && range.start.isAtStart && range.end.isAtEnd;
                    if (shouldUseBlock) {
                        const parent = range.start.parent;
                        // If color is passed - set the attribute. Remove otherwise.
                        if ( color ) {
                            // remove inside color
                            writer.removeAttribute('textColor', range);
                            writer.setAttribute( 'blockTextColor', color, parent );
                        } else {
                            writer.removeAttribute( 'blockTextColor', parent );
                        }
                    } else {

                        // If color is passed - set the attribute. Remove otherwise.
                        if (color) {
                            writer.setAttribute('textColor', color, range);
                        } else {
                            writer.removeAttribute('textColor', range);
                        }
                    }
                }
            }
        } );
    }
}
