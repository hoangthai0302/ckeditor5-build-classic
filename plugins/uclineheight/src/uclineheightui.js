/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module uclineheight/uclineheightui
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import ucLineHeightIcon from '../theme/icons/uclineheight.svg';

const UC_LINE_HEIGHT = 'ucLineHeight';

/**
 * The bold UI feature. It introduces the Bold button.
 *
 * @extends module:core/plugin~Plugin
 */
export default class UcLineHeightUI extends Plugin {
    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;
        const t = editor.t;

        // Add bold button to feature components.
        editor.ui.componentFactory.add( UC_LINE_HEIGHT, locale => {
            const command = editor.commands.get( UC_LINE_HEIGHT );
            const view = new ButtonView( UC_LINE_HEIGHT );

            view.set( {
                label: t( 'Line Height' ),
                icon: ucLineHeightIcon,
                tooltip: true
            } );

            view.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

            // add ck-uc-line-height class
            view.template.attributes.class.push('ck-uc-line-height');


            // Execute command.
            this.listenTo( view, 'execute', () => {
                const fakeEvent = document.createEvent('MouseEvent');
                const fakeTarget = document.querySelector('.ck-uc-line-height');
                const data = {};
                data.lineHeight = command.lineHeight !== undefined ? command.lineHeight : 1;

                const callback = function(lineHeight) {
                    editor.execute( UC_LINE_HEIGHT, {lineHeight: lineHeight});
                };

                this.ucLineHeightDialogOpened = true;
                editor.owner.openLineHeightDialog(editor, fakeEvent, fakeTarget, editor.owner, data, callback);
			} );

            return view;
        } );


        const viewDocument = editor.editing.view.document;

        // Close the panel on the Esc key press when the editable has focus and the balloon is visible.
        editor.keystrokes.set( 'Esc', ( data, cancel ) => {
            if (this.ucLineHeightDialogOpened === true) {
                this.ucLineHeightDialogOpened = false;
                // editor.owner.closeColorDialog(editor.owner);
            }
            cancel();
        } );

    }
}
