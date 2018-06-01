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

const UC_VIDEO = 'ucVideo';

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
        editor.ui.componentFactory.add( UC_VIDEO, locale => {
            const command = editor.commands.get( UC_VIDEO );
            const view = new ButtonView( UC_VIDEO );

            view.set( {
                label: t( 'Line Height' ),
                icon: ucLineHeightIcon,
                tooltip: true
            } );

            view.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

            // add ck-uc-line-height class
            view.template.attributes.class.push('ck-uc-video');


            // Execute command.
            this.listenTo( view, 'execute', () => {
                const fakeEvent = document.createEvent('MouseEvent');
                const fakeTarget = document.querySelector('.ck-uc-video');
                const data = {};
                data.lineHeight = command.lineHeight !== undefined ? command.lineHeight : 1;

                const callback = function(url) {
                    editor.execute( UC_VIDEO, {value: url});
                };

                this.ucLineHeightDialogOpened = true;
                editor.owner.openVideoDialog(editor, fakeEvent, fakeTarget, editor.owner, data, callback);
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
