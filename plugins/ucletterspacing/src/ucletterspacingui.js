/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module ucletterspacing/ucletterspacingui
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import ucLetterSpacingIcon from '../theme/icons/ucletterspacing.svg';

const UC_LETTER_SPACING = 'ucLetterSpacing';

/**
 * The bold UI feature. It introduces the Bold button.
 *
 * @extends module:core/plugin~Plugin
 */
export default class UcLetterSpacingUI extends Plugin {
    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;
        const t = editor.t;

        // Add bold button to feature components.
        editor.ui.componentFactory.add( UC_LETTER_SPACING, locale => {
            const command = editor.commands.get( UC_LETTER_SPACING );
            const view = new ButtonView( UC_LETTER_SPACING );

            view.set( {
                label: t( 'Color' ),
                icon: ucLetterSpacingIcon,
                tooltip: true
            } );

            view.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

            // add ck-uc-letter-spacing class
            view.template.attributes.class.push('ck-uc-letter-spacing');


            // Execute command.
            this.listenTo( view, 'execute', () => {
                const fakeEvent = document.createEvent('MouseEvent');
                const fakeTarget = document.querySelector('.ck-uc-letter-spacing');
                const data = {};
                data.letterSpacing = command.letterSpacing !== undefined ? command.letterSpacing : 0;

                const callback = function(letterSpacing) {
                    editor.execute( UC_LETTER_SPACING, {letterSpacing: letterSpacing});
                };

                this.ucLetterSpacingDialogOpened = true;
                editor.owner.openLetterSpacingDialog(editor, fakeEvent, fakeTarget, editor.owner, data, callback);
			} );

            return view;
        } );


        const viewDocument = editor.editing.view.document;

        // Close the panel on the Esc key press when the editable has focus and the balloon is visible.
        editor.keystrokes.set( 'Esc', ( data, cancel ) => {
            if (this.ucLetterSpacingDialogOpened === true) {
                this.ucLetterSpacingDialogOpened = false;
                // editor.owner.closeColorDialog(editor.owner);
            }
            cancel();
        } );

    }
}
