/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module ucvideo/ucvideostyle/ucvideostyleui
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import { normalizeUcvideoStyles } from './utils';

import '../../theme/ucvideostyle.css';

/**
 * The ucvideo style UI plugin.
 *
 * @extends module:core/plugin~Plugin
 */
export default class UcvideoStyleUI extends Plugin {
	/**
	 * Returns the default localized style titles provided by the plugin.
	 *
	 * The following localized titles corresponding with
	 * {@link module:ucvideo/ucvideostyle/utils~defaultStyles} are available:
	 *
	 * * `'Full size ucvideo'`,
	 * * `'Side ucvideo'`,
	 * * `'Left aligned ucvideo'`,
	 * * `'Centered ucvideo'`,
	 * * `'Right aligned ucvideo'`
	 *
	 * @returns {Object.<String,String>}
	 */
	get localizedDefaultStylesTitles() {
		const t = this.editor.t;

		return {
			'Full size ucvideo': t( 'Full size video' ),
			'Side ucvideo': t( 'Side video' ),
			'Left aligned ucvideo': t( 'Left alignedvideo' ),
			'Centered ucvideo': t( 'Centered video' ),
			'Right aligned ucvideo': t( 'Right aligned video' )
		};
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const configuredStyles = editor.config.get( 'ucvideo.styles' );

		const translatedStyles = translateStyles( normalizeUcvideoStyles( configuredStyles ), this.localizedDefaultStylesTitles );

		for ( const style of translatedStyles ) {
			this._createButton( style );
		}
	}

	/**
	 * Creates a button for each style and stores it in the editor {@link module:ui/componentfactory~ComponentFactory ComponentFactory}.
	 *
	 * @private
	 * @param {module:ucvideo/ucvideostyle/ucvideostyleediting~UcvideoStyleFormat} style
	 */
	_createButton( style ) {
		const editor = this.editor;

		const componentName = `ucvideoStyle:${ style.name }`;

		editor.ui.componentFactory.add( componentName, locale => {
			const command = editor.commands.get( 'ucvideoStyle' );
			const view = new ButtonView( locale );

			view.set( {
				label: style.title,
				icon: style.icon,
				tooltip: true
			} );

			view.bind( 'isEnabled' ).to( command, 'isEnabled' );
			view.bind( 'isOn' ).to( command, 'value', value => value === style.name );

			this.listenTo( view, 'execute', () => editor.execute( 'ucvideoStyle', { value: style.name } ) );

			return view;
		} );
	}
}

/**
 * Returns the translated `title` from the passed styles array.
 *
 * @param {Array.<module:ucvideo/ucvideostyle/ucvideostyleediting~UcvideoStyleFormat>} styles
 * @param titles
 * @returns {Array.<module:ucvideo/ucvideostyle/ucvideostyleediting~UcvideoStyleFormat>}
 */
function translateStyles( styles, titles ) {
	for ( const style of styles ) {
		// Localize the titles of the styles, if a title corresponds with
		// a localized default provided by the plugin.
		if ( titles[ style.title ] ) {
			style.title = titles[ style.title ];
		}
	}

	return styles;
}
