/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module basic-styles/bold/boldediting
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import UcColorCommand from './uccolorcommand';
import {downcastAttributeToElement, downcastAttributeToAttribute} from '@ckeditor/ckeditor5-engine/src/conversion/downcast-converters';
import {upcastElementToAttribute, upcastAttributeToAttribute} from '@ckeditor/ckeditor5-engine/src/conversion/upcast-converters';


/**
 * The bold editing feature.
 *
 * It registers the `bold` command and introduces the `bold` attribute in the model which renders to the view
 * as a `<strong>` element.
 *
 * @extends module:core/plugin~Plugin
 */
export default class UcColorEditing extends Plugin {
    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;
        // Allow bold attribute on text nodes.
        editor.model.schema.extend( '$text', { allowAttributes: 'textColor' } );
        editor.model.schema.extend( '$block', { allowAttributes: 'blockTextColor' } );

        // Build converter from model to view for data and editing pipelines.

        editor.conversion.for( 'downcast' )
            .add( downcastAttributeToElement( {
                model: 'textColor',
                view: ( modelAttributeValue, viewWriter ) => {
                    return viewWriter.createAttributeElement( 'font', { style: 'color:' + modelAttributeValue } );
                }
            } ) );

        editor.conversion.for( 'downcast' )
            .add( downcastAttributeToAttribute( {
                model: 'blockTextColor',
                view: modelAttributeValue => ( { key: 'style', value: { color : modelAttributeValue } } )
            } ) );


        editor.conversion.for( 'upcast' )
            .add( upcastElementToAttribute( {
                view: {
                    name: 'font'
                },
                model: {
                    key: 'textColor',
                    value: viewElement => viewElement.getStyle( 'color' )
                }
            } ) );

        editor.conversion.for( 'upcast' )
            .add( upcastAttributeToAttribute( {
                view: {
                    key: 'style',
                    value: {
                        color:/[\S]+/
                    }
                },
                model: {
                    key: 'blockTextColor',
                    value: viewElement => {
                        return viewElement.getStyle( 'color' );
                    }
                }
            } ) );

        // Create bold command.
        editor.commands.add( 'ucColor', new UcColorCommand( editor, 'blockTextColor' ) );
        editor.commands.add( 'ucColor', new UcColorCommand( editor, 'textColor' ) );
    }
}
