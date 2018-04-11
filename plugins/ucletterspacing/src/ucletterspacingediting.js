/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import UcLetterSpacingCommand from './ucletterspacingcommand';
import {downcastAttributeToElement} from '@ckeditor/ckeditor5-engine/src/conversion/downcast-converters';
import {upcastElementToAttribute} from '@ckeditor/ckeditor5-engine/src/conversion/upcast-converters';


export default class UcLetterSpacingEditing extends Plugin {
    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;
        // Allow bold attribute on text nodes.
        editor.model.schema.extend( '$text', { allowAttributes: 'letterSpacing' } );

        // Build converter from model to view for data and editing pipelines.
        editor.conversion.for( 'downcast' )
            .add( downcastAttributeToElement( {
                model: {
                    key: 'letterSpacing'
                },
                view: ( modelAttributeValue, viewWriter ) => {
                    return viewWriter.createAttributeElement( 'span', { style: 'letter-spacing:' + modelAttributeValue + 'px' } );
                }
            } ) );

        editor.conversion.for( 'upcast' )
            .add( upcastElementToAttribute( {
                view: {
                    name: 'span',
                    styles: {
                        'letter-spacing': /[\S]+/
                    }
                },
                model: {
                    key: 'letterSpacing',
                    value: viewElement => {
                        const letterSpacing = viewElement.getStyle( 'letter-spacing' );

                        if (letterSpacing === undefined) {
                            return null;
                        }

                        return letterSpacing.substr( 0, letterSpacing.length - 2 );
                    }
                }
            } ) );

        // Create bold command.
        editor.commands.add( 'ucLetterSpacing', new UcLetterSpacingCommand( editor ) );
    }
}
