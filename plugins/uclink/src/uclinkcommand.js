/**
 * @license Copyright (c) 2018, Ucraft. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module uclink/uclinkcommand
 */

import LinkCommand from '@ckeditor/ckeditor5-link/src/linkcommand';

/**
 * The link command. It is used by the {@link module:link/link~Link link feature}.
 *
 * @extends module:core/command~Command
 */
export default class UcLinkCommand extends LinkCommand {
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

        const model = this.editor.model;
        const doc = model.document;

        this.value = doc.selection.getAttribute( 'linkHref' );

        // enabled if any selection is done
        this.isEnabled = !doc.selection.isCollapsed;

        if (this.isEnabled) {
            this.isEnabled = model.schema.checkAttributeInSelection( doc.selection, 'linkHref' );
        }


        if (this.isEnabled) {
            this.isEnabled = !doc.selection.hasAttribute('linkHref');
        }
    }
}
