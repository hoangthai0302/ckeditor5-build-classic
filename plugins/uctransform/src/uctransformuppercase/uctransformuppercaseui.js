/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module uctransform/uctransformuppercase/uctransformuppercaseui
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
// import uppercaseIcon from '../../theme/icons/font-family.svg';

/**
 * The uctransform uppercase UI plugin. It introduces the `'uppercase'` button.
 *
 * @extends module:core/plugin~Plugin
 */
export default class UctransformUppercaseUI extends Plugin {
    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;
        const t = editor.t;

        editor.ui.componentFactory.add( 'ucTransformUppercase', locale => {
            const view = new ButtonView( locale );
            const command = editor.commands.get( 'ucTransformUppercase' );

            view.set( {
                label: t( 'Text Transform' ),
                // icon: uppercaseIcon,
                tooltip: true
            } );

            view.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

            // Execute command.
            this.listenTo( view, 'execute', () => editor.execute( 'ucTransformUppercase' ) );

            return view;
        } );
    }
}