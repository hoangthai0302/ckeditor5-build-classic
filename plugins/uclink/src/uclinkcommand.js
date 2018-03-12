/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module link/linkcommand
 */

import Command from '@ckeditor/ckeditor5-core/src/command';
import Text from '@ckeditor/ckeditor5-engine/src/model/text';
import Range from '@ckeditor/ckeditor5-engine/src/model/range';
import findLinkRange from './finduclinkrange';

/**
 * The link command. It is used by the {@link module:link/link~Link link feature}.
 *
 * @extends module:core/command~Command
 */
export default class LinkCommand extends Command {
	/**
	 * The value of the `'linkHref'` attribute if the start of the selection is located in a node with this attribute.
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

		this.linkHref = doc.selection.getAttribute( 'linkHref' );

        // enabled if any selection is done
        this.isEnabled = !doc.selection.isCollapsed;

        if (this.isEnabled) {
            this.isEnabled = doc.schema.checkAttributeInSelection(doc.selection, 'linkHref');
        }

		if (this.isEnabled) {
            this.isEnabled = !this.editor.document.selection.hasAttribute('linkHref');
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

				// When selection is inside text with `linkHref` attribute.
				if ( selection.hasAttribute( 'linkHref' ) ) {
					// Then update `linkHref` value.
					const linkRange = findLinkRange( selection.getFirstPosition(), selection.getAttribute( 'linkHref' ) );
                    batch.setAttribute( linkRange, 'linkHref', data.linkHref );

					// Create new range wrapping changed link.
					selection.setRanges( [ linkRange ] );
				}
			} else {
				// If selection has non-collapsed ranges, we change attribute on nodes inside those ranges
				// omitting nodes where `linkHref` attribute is disallowed.
				const ranges = doc.schema.getValidRanges( selection.getRanges(), 'linkHref' );

				for ( const range of ranges ) {
                    batch.setAttribute( range, 'linkHref', data.linkHref );
				}
			}
		} );
	}
}
