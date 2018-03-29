/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module font/fontfamily/fontfamilyui
 */

import FontFamilyUI from '@ckeditor/ckeditor5-font/src/fontfamily/fontfamilyui';
import { normalizeOptions } from './utils';

/**
 * The font family UI plugin. It introduces the `'fontFamily'` dropdown.
 *
 * @extends module:core/plugin~Plugin
 */
export default class UcFontFamilyUI extends FontFamilyUI {

    _getLocalizedOptions() {
        const editor = this.editor;
        const t = editor.t;

        const options = normalizeOptions( editor.config.get( 'fontFamily.options' ) );

        return options.map( option => {
            // The only title to localize is "Default" others are font names.
            if ( option.title === 'Default' ) {
                option.title = t( 'Default' );
            }

            return option;
        } );
    }
}
