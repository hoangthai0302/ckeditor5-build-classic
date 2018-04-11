/**
 * @license Copyright (c) 20015-2018, Ucraft. All rights reserved.
 */

/**
 * @module uctransform/uctransformuppercase/uctransformuppercaseediting
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import AttributeCommand from '../attributecommand';
import {downcastAttributeToElement, downcastAttributeToAttribute} from '@ckeditor/ckeditor5-engine/src/conversion/downcast-converters';
import {upcastElementToAttribute, upcastAttributeToAttribute} from '@ckeditor/ckeditor5-engine/src/conversion/upcast-converters';

const UC_TRANSFORM_UPPERCASE = 'ucTransformUppercase';

/**
 * The Uc Transform Uppercase editing feature.
 *
 * It introduces the {@link module:uctransform/uctransformuppercase/uctransformuppercasecommand~UctransformUppercaseCommand command} and
 * the `ucTransformUppercase` attribute in the {@link module:engine/model/model~Model model} which renders
 * in the {@link module:engine/view/view view} as an inline span (`<span style="text-transform: uppercase">`)
 *
 * @extends module:core/plugin~Plugin
 */
export default class UctransformUppercaseEditing extends Plugin {

    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;

        // Allow Transform Uppercase attribute on text nodes.
        editor.model.schema.extend( '$text', { allowAttributes: UC_TRANSFORM_UPPERCASE } );

        // editor.conversion.attributeToElement( {
        //     model: UC_TRANSFORM_UPPERCASE,
        //     view: 'span',
        //     upcastAlso: {
        //         style: {
        //             'text-decoration': 'underline'
        //         }
        //     }
        // } );

        editor.conversion.for( 'downcast' )
            .add( downcastAttributeToElement( {
                model: UC_TRANSFORM_UPPERCASE,
                view: ( modelAttributeValue, viewWriter ) => {
                    return viewWriter.createAttributeElement( 'span', { style: 'text-transform:uppercase' } );
                }
            } ) );

        editor.conversion.for( 'upcast' )
            .add( upcastElementToAttribute( {
                view: {
                    name: 'span',
                },
                model: {
                    key: UC_TRANSFORM_UPPERCASE,
                    value: viewElement => {
                        const textTransform = viewElement.getStyle( 'text-transform' );

                        if ( textTransform === undefined ) {
                            return null;
                        }

                        return textTransform;
                    }
                }
            } ) );
        editor.commands.add( UC_TRANSFORM_UPPERCASE, new AttributeCommand( editor , UC_TRANSFORM_UPPERCASE ) );
    }
}
