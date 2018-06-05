/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import first from '@ckeditor/ckeditor5-utils/src/first';

/**
 * @module ucvideo/ucvideostyle/converters
 */

/**
 * Returns a converter for the `ucvideoStyle` attribute. It can be used for adding, changing and removing the attribute.
 *
 * @param {Object} styles An object containing available styles. See {@link module:ucvideo/ucvideostyle/ucvideostyleediting~UcvideoStyleFormat}
 * for more details.
 * @returns {Function} A model-to-view attribute converter.
 */
export function modelToViewStyleAttribute( styles ) {
	return ( evt, data, conversionApi ) => {
		if ( !conversionApi.consumable.consume( data.item, evt.name ) ) {
			return;
		}

		// Check if there is class name associated with given value.
		const newStyle = getStyleByName( data.attributeNewValue, styles );
		const oldStyle = getStyleByName( data.attributeOldValue, styles );

		const viewElement = conversionApi.mapper.toViewElement( data.item );
		const viewWriter = conversionApi.writer;

		if ( oldStyle ) {
			viewWriter.removeClass( oldStyle.className, viewElement );
		}

		if ( newStyle ) {
			viewWriter.addClass( newStyle.className, viewElement );
		}
	};
}

/**
 * Returns a view-to-model converter converting ucvideo CSS classes to a proper value in the model.
 *
 * @param {Array.<module:ucvideo/ucvideostyle/ucvideostyleediting~UcvideoStyleFormat>} styles The styles for which the converter is created.
 * @returns {Function} A view-to-model converter.
 */
export function viewToModelStyleAttribute( styles ) {
	// Convert only non–default styles.
	const filteredStyles = styles.filter( style => !style.isDefault );

	return ( evt, data, conversionApi ) => {
		if ( !data.modelRange ) {
			return;
		}

		const viewVideoElement = data.viewItem;
		const modelUcvideoElement = first( data.modelRange.getItems() );

		// Check if `ucvideoStyle` attribute is allowed for current element.
		if ( !conversionApi.schema.checkAttribute( modelUcvideoElement, 'ucvideoStyle' ) ) {
			return;
		}

		// Convert style one by one.
		for ( const style of filteredStyles ) {
			// Try to consume class corresponding with style.
			if ( conversionApi.consumable.consume( viewVideoElement, { classes: style.className } ) ) {
				// And convert this style to model attribute.
				conversionApi.writer.setAttribute( 'ucvideoStyle', style.name, modelUcvideoElement );
			}
		}
	};
}

// Returns the style with a given `name` from an array of styles.
//
// @param {String} name
// @param {Array.<module:ucvideo/ucvideostyle/ucvideostyleediting~UcvideoStyleFormat> } styles
// @return {module:ucvideo/ucvideostyle/ucvideostyleediting~UcvideoStyleFormat|undefined}
function getStyleByName( name, styles ) {
	for ( const style of styles ) {
		if ( style.name === name ) {
			return style;
		}
	}
}
