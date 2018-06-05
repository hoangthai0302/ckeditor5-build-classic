/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module image/image/utils
 */

import { toWidget, isWidget } from '@ckeditor/ckeditor5-widget/src/utils';
import ModelElement from '@ckeditor/ckeditor5-engine/src/model/element';

const videoSymbool = Symbol( 'isVideo' );

/**
 * Converts a given {@link module:engine/view/element~Element} to an image widget:
 * * Adds a {@link module:engine/view/element~Element#_setCustomProperty custom property} allowing to recognize the image widget element.
 * * Calls the {@link module:widget/utils~toWidget} function with the proper element's label creator.
 *
 * @param {module:engine/view/element~Element} viewElement
 * @param {module:engine/view/writer~Writer} writer An instance of the view writer.
 * @param {String} label The element's label. It will be concatenated with the image `alt` attribute if one is present.
 * @returns {module:engine/view/element~Element}
 */
export function toVideoWidget( viewElement, writer, label ) {
    writer.setCustomProperty( videoSymbool, true, viewElement );
    return toWidget( viewElement, writer );
}

/**
 * Checks if a given view element is an image widget.
 *
 * @param {module:engine/view/element~Element} viewElement
 * @returns {Boolean}
 */
export function isVideoWidget( viewElement ) {
    return !!viewElement.getCustomProperty( videoSymbool ) && isWidget( viewElement );
}

/**
 * Checks if an image widget is the only selected element.
 *
 * @param {module:engine/view/selection~Selection|module:engine/view/documentselection~DocumentSelection} selection
 * @returns {Boolean}
 */
export function isUcvideoWidgetSelected( selection ) {
    const viewElement = selection.getSelectedElement();

    return !!( viewElement && isVideoWidget( viewElement ) );
}

/**
 * Checks if the provided model element is an instance of {@link module:engine/model/element~Element Element} and its name
 * is `image`.
 *
 * @param {module:engine/model/element~Element} modelElement
 * @returns {Boolean}
 */
export function isVideo( modelElement ) {
    return modelElement instanceof ModelElement && modelElement.name == 'ucVideo';
}

const ATTRIBUTE_WHITESPACES = /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205f\u3000]/g; // eslint-disable-line no-control-regex
const SAFE_URL = /^(?:(?:https?|ftps?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.:-]|$))/i;

/**
 * Returns a safe URL based on a given value.
 *
 * An URL is considered safe if it is safe for the user (does not contain any malicious code).
 *
 * If URL is considered unsafe, a simple `"#"` is returned.
 *
 * @protected
 * @param {*} url
 * @returns {String} Safe URL.
 */
export function ensureSafeUrl( url ) {
    url = String( url );

    return isSafeUrl( url ) ? url : '#';
}

// Checks whether the given URL is safe for the user (does not contain any malicious code).
//
// @param {String} url URL to check.
function isSafeUrl( url ) {
    const normalizedUrl = url.replace( ATTRIBUTE_WHITESPACES, '' );

    return normalizedUrl.match( SAFE_URL );
}
