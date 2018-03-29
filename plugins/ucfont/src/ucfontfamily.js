/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module font/fontfamily
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FontFamilyEditing from './ucfontfamily/ucfontfamilyediting';
import UcFontFamilyUI from './ucfontfamily/ucfontfamilyui';

/**
 * The font family plugin.
 *
 * It enables {@link module:font/fontfamily/fontfamilyediting~FontFamilyEditing} and
 * {@link module:font/fontfamily/fontfamilyui~FontFamilyUI} features in the editor.
 *
 * @extends module:core/plugin~Plugin
 */
export default class UcFontFamily extends Plugin {
    /**
     * @inheritDoc
     */
    static get requires() {
        return [ FontFamilyEditing, UcFontFamilyUI ];
    }

    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'FontFamily';
    }
}
