/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module image/image/converters
 */

import ModelPosition from '@ckeditor/ckeditor5-engine/src/model/position';
import first from '@ckeditor/ckeditor5-utils/src/first';

/**
 * Returns a function that converts the image view representation:
 *
 *		<figure class="image"><img src="..." alt="..."></img></figure>
 *
 * to the model representation:
 *
 *		<image src="..." alt="..."></image>
 *
 * The entire content of the `<figure>` element except the first `<img>` is being converted as children
 * of the `<image>` model element.
 *
 * @returns {Function}
 */
export function viewVideoToModel() {
    return dispatcher => {
        dispatcher.on( 'element:ucVideo', converter );
    };

    function converter( evt, data, conversionApi ) {
        // Do not convert if this is not an "image figure".
        if ( !conversionApi.consumable.test( data.viewItem, { name: true, classes: 'uc-video' } ) ) {
            return;
        }

        // Find an image element inside the figure element.
        const viewVideo = Array.from( data.viewItem.getChildren() ).find( viewChild => viewChild.is( 'source' ) );

        // Do not convert if image element is absent, is missing src attribute or was already converted.
        if ( !viewVideo || !viewVideo.hasAttribute( 'src' ) || !conversionApi.consumable.test( viewVideo, { name: true } ) ) {
            return;
        }

        // Convert view image to model image.
        const conversionResult = conversionApi.convertItem( viewVideo, data.modelCursor );

        // Get image element from conversion result.
        const modelVideo = first( conversionResult.modelRange.getItems() );

        // When image wasn't successfully converted then finish conversion.
        if ( !modelVideo ) {
            return;
        }

        // Convert rest of the figure element's children as an image children.
        conversionApi.convertChildren( data.viewItem, ModelPosition.createAt( modelVideo ) );

        // Set image range as conversion result.
        data.modelRange = conversionResult.modelRange;

        // Continue conversion where image conversion ends.
        data.modelCursor = conversionResult.modelCursor;
    }
}

/**
 * Converter used to convert the `srcset` model image attribute to the `srcset`, `sizes` and `width` attributes in the view.
 *
 * @return {Function}
 */
export function srcsetAttributeConverter() {
    return dispatcher => {
        dispatcher.on( 'attribute:srcset:ucVideo', converter );
    };

    function converter( evt, data, conversionApi ) {
        if ( !conversionApi.consumable.consume( data.item, evt.name ) ) {
            return;
        }

        const writer = conversionApi.writer;
        const video = conversionApi.mapper.toViewElement( data.item );
        const source = video.getChild( 0 );

        if ( data.attributeNewValue === null ) {
            const srcset = data.attributeOldValue;

            if ( srcset.data ) {
                writer.removeAttribute( 'srcset', source );
                writer.removeAttribute( 'sizes', source );

                if ( srcset.width ) {
                    writer.removeAttribute( 'width', source );
                }
            }
        } else {
            const srcset = data.attributeNewValue;

            if ( srcset.data ) {
                writer.setAttribute( 'srcset', srcset.data, source );
                // Always outputting `100vw`. See https://github.com/ckeditor/ckeditor5-image/issues/2.
                writer.setAttribute( 'sizes', '100vw', source );

                if ( srcset.width ) {
                    writer.setAttribute( 'width', srcset.width, source );
                }
            }
        }
    }
}

export function modelToViewAttributeConverter( attributeKey ) {
    return dispatcher => {
        dispatcher.on( `attribute:${ attributeKey }:ucVideo`, converter );
    };

    function converter( evt, data, conversionApi ) {
        if ( !conversionApi.consumable.consume( data.item, evt.name ) ) {
            return;
        }

        const viewWriter = conversionApi.writer;
        const video = conversionApi.mapper.toViewElement( data.item );
        const source = video.getChild( 0 );

        if ( data.attributeNewValue !== null ) {
            viewWriter.setAttribute( data.attributeKey, data.attributeNewValue, source );
        } else {
            viewWriter.removeAttribute( data.attributeKey, source );
        }
    }
}
