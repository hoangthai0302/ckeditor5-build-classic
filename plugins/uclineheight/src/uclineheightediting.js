/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import UcLineHeightCommand from './uclineheightcommand';
import {downcastAttributeToElement} from '@ckeditor/ckeditor5-engine/src/conversion/downcast-converters';
import {upcastElementToAttribute} from '@ckeditor/ckeditor5-engine/src/conversion/upcast-converters';


export default class UcLineHeightEditing extends Plugin {
    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;
        // Allow bold attribute on text nodes.
        editor.model.schema.extend( '$text', { allowAttributes: 'lineHeight' } );

        // Build converter from model to view for data and editing pipelines.

        editor.conversion.for( 'downcast' )
            .add( downcastAttributeToElement( {
                model: 'lineHeight',
                view: ( modelAttributeValue, viewWriter ) => {
                    return viewWriter.createAttributeElement( 'span', { style: 'line-height:' + modelAttributeValue } );
                }
            } ) );

        editor.conversion.for( 'upcast' )
            .add( upcastElementToAttribute( {
                view: {
                    name: 'span'
                },
                model: {
                    key: 'lineHeight',
                    value: viewElement => viewElement.getStyle( 'line-height' )
                }
            } ) );

        // Create bold command.
        editor.commands.add( 'ucLineHeight', new UcLineHeightCommand( editor, 'lineHeight' ) );
    }
}
