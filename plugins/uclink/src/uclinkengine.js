/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module link/linkengine
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import buildModelConverter from '@ckeditor/ckeditor5-engine/src/conversion/buildmodelconverter';
import buildViewConverter from '@ckeditor/ckeditor5-engine/src/conversion/buildviewconverter';
import LinkElement from './uclinkelement';
import LinkCommand from './uclinkcommand';
import UnlinkCommand from './ucunlinkcommand';

/**
 * The link engine feature.
 *
 * It introduces the `linkHref="url"` attribute in the model which renders to the view as a `<a href="url">` element.
 *
 * @extends module:core/plugin~Plugin
 */
export default class LinkEngine extends Plugin {
	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const data = editor.data;
		const editing = editor.editing;

		// Allow link attribute on all inline nodes.
		editor.document.schema.allow( { name: '$inline', attributes: 'linkHref', inside: '$block' } );
		// Temporary workaround. See https://github.com/ckeditor/ckeditor5/issues/477.
		editor.document.schema.allow( { name: '$inline', attributes: 'linkHref', inside: '$clipboardHolder' } );
        editor.document.schema.allow( { name: '$inline', attributes: 'linkRel', inside: '$block' } );
        editor.document.schema.allow( { name: '$inline', attributes: 'linkRel', inside: '$clipboardHolder' } );
        editor.document.schema.allow( { name: '$inline', attributes: 'linkTarget', inside: '$block' } );
        editor.document.schema.allow( { name: '$inline', attributes: 'linkTarget', inside: '$clipboardHolder' } );
        editor.document.schema.allow( { name: '$inline', attributes: 'linkUnderline', inside: '$block' } );
        editor.document.schema.allow( { name: '$inline', attributes: 'linkUnderline', inside: '$clipboardHolder' } );

		// Build converter from model to view for data and editing pipelines.
		buildModelConverter().for( data.modelToView, editing.modelToView )
			.fromAttribute( 'linkHref' )
			.toElement( linkHref => {
				const linkElement = new LinkElement( 'a', { href: linkHref } );

				// https://github.com/ckeditor/ckeditor5-link/issues/121
				linkElement.priority = 5;

				return linkElement;
			} );

        buildModelConverter().for( data.modelToView, editing.modelToView )
            .fromAttribute( 'linkRel' )
            .toElement( linkRel => {
                const linkElement = new LinkElement( 'a', { href: linkRel } );

                // https://github.com/ckeditor/ckeditor5-link/issues/121
                linkElement.priority = 5;

                return linkElement;
            } );

		// Build converter from view to model for data pipeline.
		buildViewConverter().for( data.viewToModel )
			// Convert <a> with href (value doesn't matter).
			.from( { name: 'a', attribute: { href: /.?/ } } )
			.toAttribute( viewElement => ( {
				key: 'linkHref',
				value: viewElement.getAttribute( 'href' )
			} ) );

		// Create linking commands.
		editor.commands.add( 'ucLink', new LinkCommand( editor ) );
		editor.commands.add( 'ucUnlink', new UnlinkCommand( editor ) );
	}
}
