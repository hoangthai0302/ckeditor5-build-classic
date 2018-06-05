/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module ucvideo/ucvideostyle
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import UcvideoStyleEditing from './ucvideostyle/ucvideostyleediting';
import UcvideoStyleUI from './ucvideostyle/ucvideostyleui';

/**
 * The ucvideo style plugin.
 *
 * It loads the {@link module:ucvideo/ucvideostyle/ucvideostyleediting~UcvideoStyleEditing}
 * and {@link module:ucvideo/ucvideostyle/ucvideostyleui~UcvideoStyleUI} plugins.
 *
 * For a detailed overview, check the {@glink features/ucvideo#ucvideo-styles ucvideo styles} documentation.
 *
 * @extends module:core/plugin~Plugin
 */
export default class UcvideoStyle extends Plugin {
    /**
     * @inheritDoc
     */
    static get requires() {
        return [ UcvideoStyleEditing, UcvideoStyleUI ];
    }

    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'UcvideoStyle';
    }
}

/**
 * Available ucvideo styles.
 *
 * The default value is:
 *
 *		const ucvideoConfig = {
 *			styles: [ 'full', 'side' ]
 *		};
 *
 * which configures two default styles:
 *
 *  * the "full" style which does not apply any class, e.g. for ucvideos styled to span 100% width of the content,
 *  * the "side" style with the `.ucvideo-style-side` CSS class.
 *
 * See {@link module:ucvideo/ucvideostyle/utils~defaultStyles} to learn more about default
 * styles provided by the ucvideo feature.
 *
 * The {@link module:ucvideo/ucvideostyle/utils~defaultStyles default styles} can be customized,
 * e.g. to change the icon, title or CSS class of the style. The feature also provides several
 * {@link module:ucvideo/ucvideostyle/utils~defaultIcons default icons} to choose from.
 *
 *		import customIcon from 'custom-icon.svg';
 *
 *		// ...
 *
 *		const ucvideoConfig = {
 *			styles: [
 *				// This will only customize the icon of the "full" style.
 *				// Note: 'right' is one of default icons provided by the feature.
 *				{ name: 'full', icon: 'right' },
 *
 *				// This will customize the icon, title and CSS class of the default "side" style.
 *				{ name: 'side', icon: customIcon, title: 'My side style', class: 'custom-side-ucvideo' }
 *			]
 *		};
 *
 * If none of the default styles is good enough, it is possible to define independent custom styles, too:
 *
 *		import fullSizeIcon from '@ckeditor/ckeditor5-core/theme/icons/object-center.svg';
 *		import sideIcon from '@ckeditor/ckeditor5-core/theme/icons/object-right.svg';
 *
 *		// ...
 *
 *		const ucvideoConfig = {
 *			styles: [
 *				// A completely custom full size style with no class, used as a default.
 *				{ name: 'fullSize', title: 'Full size', icon: fullSizeIcon, isDefault: true },
 *
 *				{ name: 'side', title: 'To the side', icon: sideIcon, className: 'side-ucvideo' }
 *			]
 *		};
 *
 * Note: Setting `title` to one of {@link module:ucvideo/ucvideostyle/ucvideostyleui~UcvideoStyleUI#localizedDefaultStylesTitles}
 * will automatically translate it to the language of the editor.
 *
 * Read more about styling ucvideos in the {@glink features/ucvideo#ucvideo-styles Ucvideo styles guide}.
 *
 * The feature creates commands based on defined styles, so you can change the style of a selected ucvideo by executing
 * the following command:
 *
 *		editor.execute( 'ucvideoStyle' { value: 'side' } );
 *
 * The feature also creates buttons that execute the commands. So, assuming that you use the
 * default ucvideo styles setting, you can {@link module:ucvideo/ucvideo~UcvideoConfig#toolbar configure the ucvideo toolbar}
 * (or any other toolbar) to contain these options:
 *
 *		const ucvideoConfig = {
 *			toolbar: [ 'ucvideoStyle:full', 'ucvideoStyle:side' ]
 *		};
 *
 * @member {Array.<module:ucvideo/ucvideostyle/ucvideostyleediting~UcvideoStyleFormat>} module:ucvideo/ucvideo~UcvideoConfig#styles
 */
