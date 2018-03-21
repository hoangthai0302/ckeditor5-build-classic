/**
 * @license Copyright (c) 2018, Ucraft. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module ucmedia
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import UcMediaUI from './ucmediaui';
// import UcMediaEditing from './ucmediaediting';

/**
 * Ucraft Media plugin.
 *
 * This plugin do not do anything directly, but opens the Media manager and insert the selected image in the editor:
 *
 * @extends module:core/plugin~Plugin
 */
export default class UcMedia extends Plugin {
    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'UcMedia';
    }

    /**
     * @inheritDoc
     */
    static get requires() {
        return [ UcMediaUI ];
    }
}


// import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
// import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
// import ModelElement from '@ckeditor/ckeditor5-engine/src/model/element';
//
// import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
//
// class UcMedia extends Plugin {
//     init() {
//         const editor = this.editor;
//
//         editor.ui.componentFactory.add( 'ucMedia', locale => {
//             const view = new ButtonView( locale );
//
//             view.set( {
//                 label: 'Select image from Media Manager',
//                 icon: imageIcon,
//                 tooltip: true
//             } );
//
//             view.on( 'execute', () => {
//
//                 // We will be using Media Manager
//                 // editor will have an property owner
//                 if (editor.owner === undefined) {
//                     alert('Onwer for Editor is not defined.');
//                     return false;
//                 }
//
//                 let callback = function(imageUrl) {
//                     editor.document.enqueueChanges( () => {
//                         const imageElement = new ModelElement( 'image', {
//                             src: imageUrl
//                         } );
//
//                         editor.data.insertContent( imageElement, editor.document.selection );
//                     } );
//                 };
//
//                 editor.owner.openMedia(callback);
//
//             } );
//
//             return view;
//         } );
//     }
// }
//
// export default UcMedia;
