/**
 * @license Copyright (c) 2018, Ucraft. All rights reserved.
 * For licensing, see LICENSE.md.
 */
/**
 * @module ucmediaui
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';

/**
 * Image insert button plugin.
 * Adds `ucMedia` button to UI component factory.
 *
 * @extends module:core/plugin~Plugin
 */
export default class ImageUploadUI extends Plugin {
    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;
        const t = editor.t;

        // Setup `imageUpload` button.
        editor.ui.componentFactory.add( 'ucMedia', locale => {
            const view = new ButtonView( locale );
            const command = editor.commands.get( 'ucMedia' );

            view.set( {
                label: t( 'Insert image' ),
                icon: imageIcon,
                tooltip: true
            } );

            // Callback executed once the image is clicked.
            view.on( 'execute', () => {
                // We will be using Media Manager
                // editor will have an property owner
                if (editor.owner === undefined) {
                    alert('Onwer for Editor is not defined.');
                    return false;
                }

                let callback = function(imageUrl) {
                    editor.model.change( writer => {
                        const imageElement = writer.createElement( 'image', {
                            src: imageUrl
                        } );
                        // Insert the image in the current selection location.
                        editor.model.insertContent( imageElement, editor.model.document.selection );
                    });
                };

                editor.owner.openMedia(callback);
            } );

            return view;
        } );
    }
}
