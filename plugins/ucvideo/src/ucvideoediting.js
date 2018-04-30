/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module image/image/imageediting
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import {
    viewVideoToModel,
    modelToViewAttributeConverter,
    srcsetAttributeConverter
} from './converters';

import { toVideoWidget } from './utils';

import { downcastElementToElement } from '@ckeditor/ckeditor5-engine/src/conversion/downcast-converters';
import { upcastElementToElement, upcastAttributeToAttribute } from '@ckeditor/ckeditor5-engine/src/conversion/upcast-converters';

import ViewPosition from '@ckeditor/ckeditor5-engine/src/view/position';

/**
 * The image engine plugin.
 * It registers `<image>` as a block element in the document schema, and allows `alt`, `src` and `srcset` attributes.
 * It also egisters converters for editing and data pipelines.
 *
 * @extends module:core/plugin~Plugin
 */
export default class UcVideoEditing extends Plugin {
    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;
        const schema = editor.model.schema;
        const t = editor.t;
        const conversion = editor.conversion;

        // Configure schema.
        schema.register( 'ucVideo', {
            isObject: true,
            isBlock: true,
            allowWhere: '$block',
            allowAttributes: ['src', 'type' ]
        } );

        conversion.for( 'dataDowncast' ).add( downcastElementToElement( {
            model: 'ucVideo',
            view: ( modelElement, viewWriter ) => createVideoViewElement( viewWriter )
        } ) );

        conversion.for( 'editingDowncast' ).add( downcastElementToElement( {
            model: 'ucVideo',
            view: ( modelElement, viewWriter ) => toVideoWidget( createVideoViewElement( viewWriter ), viewWriter, t( 'video widget' ) )
        } ) );

        conversion.for( 'downcast' )
            .add( modelToViewAttributeConverter( 'type' ) )
            .add( modelToViewAttributeConverter( 'src' ) );

        conversion.for( 'upcast' )
            .add( upcastElementToElement( {
                view: {
                    name: 'source',
                    attributes: {
                        'type': true
                    }
                },
                model: ( viewSource, modelWriter ) => modelWriter.createElement( 'ucVideo', { 'type': viewSource.getAttribute( 'type' ) } )
            } ) )
            .add( upcastAttributeToAttribute( {
                view: {
                    name: 'source',
                    key: 'src'
                },
                model: 'src'
            } ) )
            .add( viewVideoToModel() );
    }
}

// Creates a view element representing the image.
//
//		<figure class="image"><img></img></figure>
//
// Note that `alt` and `src` attributes are converted separately, so they are not included.
//
// @private
// @param {module:engine/view/writer~Writer} writer
// @return {module:engine/view/containerelement~ContainerElement}
export function createVideoViewElement( writer ) {
    const emptyElement = writer.createEmptyElement( 'source' );
    const video = writer.createContainerElement( 'video', { controls: '', class: 'uc-video' } );

    writer.insert( ViewPosition.createAt( video ), emptyElement );

    return video;
}
