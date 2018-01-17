/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* eslint-env browser */

'use strict';

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import ModelElement from '@ckeditor/ckeditor5-engine/src/model/element';

import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';

class UcMedia extends Plugin {
    init() {
        const editor = this.editor;

        editor.ui.componentFactory.add( 'ucMedia', locale => {
            const view = new ButtonView( locale );

            view.set( {
                label: 'Select image from Media Manager',
                icon: imageIcon,
                tooltip: true
            } );

            view.on( 'execute', () => {

                // We will be using Media Manager
                // editor will have an property owner
                if (editor.owner === undefined) {
                    alert('Onwer for Editor is not defined.');
                    return false;
                }

                let callback = function(imageUrl) {
                    editor.document.enqueueChanges( () => {
                        alert(imageUrl);
                        const imageElement = new ModelElement( 'image', {
                            src: imageUrl
                        } );

                        editor.data.insertContent( imageElement, editor.document.selection );
                    } );
                };

                editor.owner.openMedia(callback);

            } );

            return view;
        } );
    }
}

export default UcMedia;
