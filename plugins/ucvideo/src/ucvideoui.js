/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module ucvideo/ucvideoui
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import ucVideoIcon from '../theme/icons/ucvideo.svg';

const UC_VIDEO = 'ucVideo';

/**
 * The bold UI feature. It introduces the Bold button.
 *
 * @extends module:core/plugin~Plugin
 */
export default class UcVideoUI extends Plugin {
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
                label: t( 'Video' ),
                icon: ucVideoIcon,
                tooltip: true
            } );

            // view.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

            // add ck-uc-video class
            view.template.attributes.class.push('ck-uc-video');


            // Execute command.
            this.listenTo( view, 'execute', () => {
                const fakeEvent = document.createEvent('MouseEvent');
                const fakeTarget = document.querySelector('.ck-uc-video');
                const data = {};

                const callback = function(url) {
                    editor.model.change( writer => {
                        const videoElement = writer.createElement( 'ucVideo', {
                            src: 'https://www.w3schools.com/html/mov_bbb.mp4'
                        } );
                        // Insert the image in the current selection location.
                        editor.model.insertContent( videoElement, editor.model.document.selection );
                    });
                };

                this.ucVideoDialogOpened = true;
                editor.owner.openVideoDialog(editor, fakeEvent, fakeTarget, editor.owner, data, callback);
			} );

            return view;
        } );


        const viewDocument = editor.editing.view.document;

        // Close the panel on the Esc key press when the editable has focus and the balloon is visible.
        editor.keystrokes.set( 'Esc', ( data, cancel ) => {
            if (this.ucVideoDialogOpened === true) {
                this.ucVideoDialogOpened = false;
                editor.owner.closeVideoDialog(editor.owner);
            }
            cancel();
        } );

    }
}
