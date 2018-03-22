/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module link/linkcommand
 */

import Command from '@ckeditor/ckeditor5-core/src/command';
import Range from '@ckeditor/ckeditor5-engine/src/model/range';
import findUcColorRange from './finduccolorrange';

export default class UcColorCommand extends Command {
    /**
     * The value of the `'textColor'` attribute if the start of the selection is located in a node with this attribute.
     *
     * @observable
     * @readonly
     * @member {Object|undefined} #value
     */

    /**
     * @inheritDoc
     */
    refresh() {
        const doc = this.editor.document;

        this.textColor = doc.selection.getAttribute( 'textColor' );

        // enabled if any selection is done
        this.isEnabled = !doc.selection.isCollapsed;

        if (this.isEnabled) {
            this.isEnabled = doc.schema.checkAttributeInSelection(doc.selection, 'textColor');
        }
    }

    execute( data ) {
        const doc = this.editor.document;
        const selection = doc.selection;

        doc.enqueueChanges( () => {
            // Keep it as one undo step.
            const batch = doc.batch();

            // If selection is collapsed then update selected link or insert new one at the place of caret.
            if ( selection.isCollapsed ) {
                const position = selection.getFirstPosition();

                // When selection is inside text with `textColor` attribute.
                if ( selection.hasAttribute( 'textColor' ) ) {
                    // Then update `textColor` value.
                    const ucColorRange = findUcColorRange( selection.getFirstPosition(), selection.getAttribute( 'textColor' ) );
                    batch.setAttribute( ucColorRange, 'textColor', data.textColor );

                    // Create new range wrapping changed link.
                    selection.setRanges( [ ucColorRange ] );
                }
            } else {
                // If selection has non-collapsed ranges, we change attribute on nodes inside those ranges
                // omitting nodes where `textColor` attribute is disallowed.
                const ranges = doc.schema.getValidRanges( selection.getRanges(), 'textColor' );

                for ( const range of ranges ) {
                    batch.setAttribute( range, 'textColor', data.textColor );
                }
            }
        } );
    }
}
