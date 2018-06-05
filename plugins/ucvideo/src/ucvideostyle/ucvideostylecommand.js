/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module ucvideo/ucvideostyle/ucvideostylecommand
 */

import Command from '@ckeditor/ckeditor5-core/src/command';
import { isVideo } from '../ucvideo/utils';

/**
 * The ucvideo style command. It is used to apply different ucvideo styles.
 *
 * @extends module:core/command~Command
 */
export default class UcvideoStyleCommand extends Command {
	/**
	 * Creates an instance of the ucvideo style command. Each command instance is handling one style.
	 *
	 * @param {module:core/editor/editor~Editor} editor The editor instance.
	 * @param {Array.<module:ucvideo/ucvideostyle/ucvideostyleediting~UcvideoStyleFormat>} styles The styles that this command supports.
	 */
	constructor( editor, styles ) {
		super( editor );

		/**
		 * The cached name of the default style if it is present. If there is no default style, it defaults to `false`.
		 *
		 * @type {Boolean|String}
		 * @private
		 */
		this._defaultStyle = false;

		/**
		 * A style handled by this command.
		 *
		 * @readonly
		 * @member {Array.<module:ucvideo/ucvideostyle/ucvideostyleediting~UcvideoStyleFormat>} #styles
		 */
		this.styles = styles.reduce( ( styles, style ) => {
			styles[ style.name ] = style;

			if ( style.isDefault ) {
				this._defaultStyle = style.name;
			}

			return styles;
		}, {} );
	}

	/**
	 * @inheritDoc
	 */
	refresh() {
		const element = this.editor.model.document.selection.getSelectedElement();

		this.isEnabled = isVideo( element );

		if ( !element ) {
			this.value = false;
		} else if ( element.hasAttribute( 'ucvideoStyle' ) ) {
			const attributeValue = element.getAttribute( 'ucvideoStyle' );
			this.value = this.styles[ attributeValue ] ? attributeValue : false;
		} else {
			this.value = this._defaultStyle;
		}
	}

	/**
	 * Executes the command.
	 *
	 *		editor.execute( 'ucvideoStyle', { value: 'side' } );
	 *
	 * @param {Object} options
	 * @param {String} options.value The name of the style (based on the
	 * {@link module:ucvideo/ucvideo~UcvideoConfig#styles `ucvideo.styles`} configuration option).
	 * @fires execute
	 */
	execute( options ) {
		const styleName = options.value;

		const model = this.editor.model;
		const ucvideoElement = model.document.selection.getSelectedElement();

		model.change( writer => {
			// Default style means that there is no `ucvideoStyle` attribute in the model.
			// https://github.com/ckeditor/ckeditor5-ucvideo/issues/147
			if ( this.styles[ styleName ].isDefault ) {
				writer.removeAttribute( 'ucvideoStyle', ucvideoElement );
			} else {
				writer.setAttribute( 'ucvideoStyle', styleName, ucvideoElement );
			}
		} );
	}
}
