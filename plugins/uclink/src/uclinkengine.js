/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import buildModelConverter from '@ckeditor/ckeditor5-engine/src/conversion/buildmodelconverter';
import buildViewConverter from '@ckeditor/ckeditor5-engine/src/conversion/buildviewconverter';
import UcLinkElement from './uclinkelement';
import UcLinkCommand from './uclinkcommand';
import UnlinkCommand from './ucunlinkcommand';

export default class UcLinkEngine extends Plugin {
	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const data = editor.data;
		const editing = editor.editing;

		// Allow link attribute on all inline nodes.
		editor.document.schema.allow( { name: '$inline', attributes: 'linkHref', inside: '$block' } );
		editor.document.schema.allow( { name: '$inline', attributes: 'linkHref', inside: '$clipboardHolder' } );

		// Build converter from model to view for data and editing pipelines.
		buildModelConverter().for( data.modelToView, editing.modelToView )
			.fromAttribute( 'linkHref' )
			.toElement( linkHref => {
				const linkElement = new UcLinkElement( 'a', { href: linkHref } );
				linkElement.priority = 5;

				return linkElement;
			} );

		// Build converter from view to model for data pipeline.
		buildViewConverter().for( data.viewToModel )
			// Convert <a> with href (value doesn't matter).
			.from( { name: 'a', attribute: { href: /.?/ } } )
            .from( { name: 'a', attribute: { href: /.?/ } } )
            .toAttribute( viewElement => ( {
                key: 'linkHref',
                value: viewElement.getAttribute( 'href' )
            } ) );

        // Create linking commands.
		editor.commands.add( 'ucLink', new UcLinkCommand( editor ) );
		editor.commands.add( 'ucUnlink', new UnlinkCommand( editor ) );
	}
}
