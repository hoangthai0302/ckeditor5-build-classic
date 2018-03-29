/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module font/fontfamily/fontfamilyediting
 */

import FontFamilyEditing from '@ckeditor/ckeditor5-font/src/fontfamily/fontfamilyediting';

import FontFamilyCommand from '@ckeditor/ckeditor5-font/src/fontfamily/fontfamilycommand';
import { normalizeOptions } from './utils';
import { buildDefinition } from '@ckeditor/ckeditor5-font/src//utils';

const FONT_FAMILY = 'fontFamily';

/**
 * The font family editing feature.
 *
 * It introduces the {@link module:font/fontfamily/fontfamilycommand~FontFamilyCommand command} and
 * the `fontFamily` attribute in the {@link module:engine/model/model~Model model} which renders
 * in the {@link module:engine/view/view view} as an inline span (`<span style="font-family: Arial">`),
 * depending on the {@link module:font/fontfamily~FontFamilyConfig configuration}.
 *
 * @extends module:core/plugin~Plugin
 */
export default class UcFontFamilyEditing extends FontFamilyEditing {

    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;

        // Allow fontFamily attribute on text nodes.
        editor.model.schema.extend( '$text', { allowAttributes: FONT_FAMILY } );

        // Get configured font family options without "default" option.
        const options = normalizeOptions( editor.config.get( 'fontFamily.options' ) ).filter( item => item.model );
        const definition = buildDefinition( FONT_FAMILY, options );

        // Set-up the two-way conversion.
        editor.conversion.attributeToElement( definition );

        editor.commands.add( FONT_FAMILY, new FontFamilyCommand( editor ) );
    }
}
