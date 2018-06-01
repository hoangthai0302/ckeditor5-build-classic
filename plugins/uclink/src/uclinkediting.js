/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module link/linkediting
 */

import LinkEditing from '@ckeditor/ckeditor5-link/src/linkediting';
import {
	downcastAttributeToElement
} from '@ckeditor/ckeditor5-engine/src/conversion/downcast-converters';
import { upcastElementToAttribute } from '@ckeditor/ckeditor5-engine/src/conversion/upcast-converters';
import LinkCommand from './uclinkcommand';
import UnlinkCommand from './ucunlinkcommand';
import { createLinkElement, ensureSafeUrl } from '@ckeditor/ckeditor5-link/src/utils';
import bindTwoStepCaretToAttribute from '@ckeditor/ckeditor5-engine/src/utils/bindtwostepcarettoattribute';

/**
 * The link engine feature.
 *
 * It introduces the `linkHref="url"` attribute in the model which renders to the view as a `<a href="url">` element.
 *
 * @extends module:core/plugin~Plugin
 */
export default class UcLinkEditing extends LinkEditing {
	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;

		// Allow link attribute on all inline nodes.
		editor.model.schema.extend( '$text', { allowAttributes: 'linkHref' } );

        editor.conversion.for( 'dataDowncast' )
            .add( downcastAttributeToElement( { model: 'linkHref', view: createLinkElement } ) );

        editor.conversion.for( 'editingDowncast' )
            .add( downcastAttributeToElement( { model: 'linkHref', view: ( href, writer ) => {
                return createLinkElement( ensureSafeUrl( href ), writer );
            } } ) );

		editor.conversion.for( 'upcast' )
			.add( upcastElementToAttribute( {
				view: {
					name: 'a',
					attribute: {
						href: true
					}
				},
				model: {
					key: 'linkHref',
					value: viewElement => viewElement.getAttribute( 'href' )
				}
			} ) );

		// Create linking commands.
		editor.commands.add( 'ucLink', new LinkCommand( editor ) );
		editor.commands.add( 'ucUnlink', new UnlinkCommand( editor ) );

		// Enable two-step caret movement for `linkHref` attribute.
		bindTwoStepCaretToAttribute( editor.editing.view, editor.model, this, 'linkHref' );

		// Setup highlight over selected link.
		this._setupLinkHighlight();
	}
}
