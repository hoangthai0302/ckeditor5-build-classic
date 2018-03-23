/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module uccolor/uccolorui
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import ucColorIcon from '../theme/icons/link.svg';

const UCCOLOR = 'ucColor';

/**
 * The bold UI feature. It introduces the Bold button.
 *
 * @extends module:core/plugin~Plugin
 */
export default class UcColorUI extends Plugin {
    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;
        const t = editor.t;

        // Add bold button to feature components.
        editor.ui.componentFactory.add( UCCOLOR, locale => {
            const command = editor.commands.get( UCCOLOR );
            const view = new ButtonView( UCCOLOR );

            view.set( {
                label: t( 'Color' ),
                icon: ucColorIcon,
                tooltip: true
            } );

            view.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

            // add ck-uccolor class
            view.template.attributes.class.push('ck-uccolor');


            // Execute command.
            this.listenTo( view, 'execute', () => {
                editor.execute( UCCOLOR, {textColor: 'red'});
                // const fakeEvent = document.createEvent('MouseEvent');
                // const fakeTarget = document.querySelector('.ck-uccolor');
                // const data = {};
                // data.color = command.textColor !== undefined ? command.textColor : '#353535';
                //
                // const callback = function(color) {
                //     editor.execute( UCCOLOR, {textColor: color});
                // };
                //
                // this.ucColorDialogOpened = true;
                // editor.owner.openColorDialog(editor, fakeEvent, fakeTarget, editor.owner, data, callback);
			} );

            return view;
        } );


        const viewDocument = editor.editing.view.document;

        // Close the panel on the Esc key press when the editable has focus and the balloon is visible.
        editor.keystrokes.set( 'Esc', ( data, cancel ) => {
            if (this.ucColorDialogOpened === true) {
                this.ucColorDialogOpened = false;
                // editor.owner.closeColorDialog(editor.owner);
            }
            cancel();
        } );

    }
}
