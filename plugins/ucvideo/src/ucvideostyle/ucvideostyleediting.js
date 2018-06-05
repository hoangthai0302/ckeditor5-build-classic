/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module ucvideo/ucvideostyle/ucvideostyleediting
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import UcvideoStyleCommand from './ucvideostylecommand';
import UcvideoEditing from '../ucvideo/ucvideoediting';
import { viewToModelStyleAttribute, modelToViewStyleAttribute } from './converters';
import { normalizeUcvideoStyles } from './utils';

/**
 * The ucvideo style engine plugin. It sets the default configuration, creates converters and registers
 * {@link module:ucvideo/ucvideostyle/ucvideostylecommand~UcvideoStyleCommand UcvideoStyleCommand}.
 *
 * @extends {module:core/plugin~Plugin}
 */
export default class UcvideoStyleEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ UcvideoEditing ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'UcvideoStyleEditing';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const schema = editor.model.schema;
		const data = editor.data;
		const editing = editor.editing;

		// Define default configuration.
		editor.config.define( 'ucvideo.styles', [ 'full', 'side' ] );

		// Get configuration.
		const styles = normalizeUcvideoStyles( editor.config.get( 'ucvideo.styles' ) );

		// Allow ucvideoStyle attribute in ucvideo.
		// We could call it 'style' but https://github.com/ckeditor/ckeditor5-engine/issues/559.
		schema.extend( 'ucVideo', { allowAttributes: 'ucvideoStyle' } );

		// Converters for ucvideoStyle attribute from model to view.
		const modelToViewConverter = modelToViewStyleAttribute( styles );
		editing.downcastDispatcher.on( 'attribute:ucvideoStyle:ucVideo', modelToViewConverter );
		data.downcastDispatcher.on( 'attribute:ucvideoStyle:ucVideo', modelToViewConverter );

		// Converter for figure element from view to model.
		data.upcastDispatcher.on( 'element:video', viewToModelStyleAttribute( styles ), { priority: 'low' } );

		// Register ucvideoStyle command.
		editor.commands.add( 'ucvideoStyle', new UcvideoStyleCommand( editor, styles ) );
	}
}

/**
 * The ucvideo style format descriptor.
 *
 *		import fullSizeIcon from 'path/to/icon.svg';
 *
 *		const ucvideoStyleFormat = {
 *			name: 'fullSize',
 *			icon: fullSizeIcon,
 *			title: 'Full size ucvideo',
 *			className: 'ucvideo-full-size'
 *		}
 *
 * @typedef {Object} module:ucvideo/ucvideostyle/ucvideostyleediting~UcvideoStyleFormat
 *
 * @property {String} name The unique name of the style. It will be used to:
 *
 * * Store the chosen style in the model by setting the `ucvideoStyle` attribute of the `<ucvideo>` element.
 * * As a value of the {@link module:ucvideo/ucvideostyle/ucvideostylecommand~UcvideoStyleCommand#execute `ucvideoStyle` command},
 * * when registering a button for each of the styles (`'ucvideoStyle:{name}'`) in the
 * {@link module:ui/componentfactory~ComponentFactory UI components factory} (this functionality is provided by the
 * {@link module:ucvideo/ucvideostyle/ucvideostyleui~UcvideoStyleUI} plugin).
 *
 * @property {Boolean} [isDefault] When set, the style will be used as the default one.
 * A default style does not apply any CSS class to the view element.
 *
 * @property {String} icon One of the following to be used when creating the style's button:
 *
 * * An SVG icon source (as an XML string).
 * * One of {@link module:ucvideo/ucvideostyle/utils~defaultIcons} to use a default icon provided by the plugin.
 *
 * @property {String} title The style's title.
 *
 * @property {String} className The CSS class used to represent the style in the view.
 */
