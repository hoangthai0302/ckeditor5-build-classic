/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module link/ui/linkformview
 */

import View from '@ckeditor/ckeditor5-ui/src/view';
import ViewCollection from '@ckeditor/ckeditor5-ui/src/viewcollection';

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import LabeledInputView from '@ckeditor/ckeditor5-ui/src/labeledinput/labeledinputview';
import InputTextView from '@ckeditor/ckeditor5-ui/src/inputtext/inputtextview';

import submitHandler from '@ckeditor/ckeditor5-ui/src/bindings/submithandler';
import FocusTracker from '@ckeditor/ckeditor5-utils/src/focustracker';
import FocusCycler from '@ckeditor/ckeditor5-ui/src/focuscycler';
import KeystrokeHandler from '@ckeditor/ckeditor5-utils/src/keystrokehandler';

/**
 * The link form view controller class.
 *
 * See {@link module:link/ui/linkformview~LinkFormView}.
 *
 * @extends module:ui/view~View
 */
export default class LinkFormView extends View {
    /**
     * @inheritDoc
     */
    constructor( locale ) {
        super( locale );

        const t = locale.t;

        this.textInput = this._createInput();
        this.textInput.extendTemplate( {
            attributes: {
                class: [
                    'ck-uccolorpicker-input'
                ]
            }
        } );

        this.setTemplate( {
            tag: 'div',

            attributes: {
                class: [
                    'ck-uccolorpicker-form',
                ],

                // https://github.com/ckeditor/ckeditor5-link/issues/90
                tabindex: '-1'
            },

            children: [
                this.textInput,
                {
                    tag: 'div',

                    attributes: {
                        class: [
                            'ck-uccolorpicker-container'
                        ]
                    }
                }
            ]
        } );
    }

    /**
     * @inheritDoc
     */
    render() {
        super.render();

        submitHandler( {
            view: this
        } );
    }

    /**
     * Creates a labeled input view.
     *
     * @private
     * @returns {module:ui/labeledinput/labeledinputview~LabeledInputView} Labeled input view instance.
     */
    _createInput() {
        const t = this.locale.t;

        const input = new InputTextView( this.locale );

        input.placeholder = 'https://example.com';

        return input;
    }
}