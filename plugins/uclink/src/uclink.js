/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module link/link
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ClickObserver from '@ckeditor/ckeditor5-engine/src/view/observer/clickobserver';
import Range from '@ckeditor/ckeditor5-engine/src/view/range';
import LinkEngine from './uclinkengine';
import LinkElement from './uclinkelement';

import clickOutsideHandler from '@ckeditor/ckeditor5-ui/src/bindings/clickoutsidehandler';

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import LinkFormView from './ui/linkformview';

import linkIcon from '../theme/icons/link.svg';
import unlinkIcon from '../theme/icons/unlink.svg';
import '../theme/theme.scss';

const linkKeystroke = 'Ctrl+K';

export default class Link extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ LinkEngine ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ucLink';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;

		editor.editing.view.addObserver( ClickObserver );

		// Create toolbar buttons.
		this._createToolbarLinkButton();

		// Attach lifecycle actions to the the panel.
		this._attachActions();
	}

	_createToolbarLinkButton() {
		const editor = this.editor;
		const linkCommand = editor.commands.get( 'ucLink' );
        const unlinkCommand = editor.commands.get( 'ucUnlink' );
		const t = editor.t;

		// Handle the `Ctrl+K` keystroke and show the panel.
		editor.keystrokes.set( linkKeystroke, ( keyEvtData, cancel ) => {
			// Prevent focusing the search bar in FF and opening new tab in Edge. #153, #154.
			cancel();

			if ( linkCommand.isEnabled ) {
				this._showPanel( true );
			}
		} );

		editor.ui.componentFactory.add( 'ucLink', locale => {
			const button = new ButtonView( locale );

			button.isEnabled = true;
			button.label = t( 'ucLink' );
			button.icon = linkIcon;
			button.keystroke = linkKeystroke;
			button.tooltip = true;

			// Bind button to the command.
			button.bind( 'isEnabled' ).to( linkCommand, 'isEnabled' );

			// Show the panel on button click.
			this.listenTo( button, 'execute', () => this._showPanel( true ) );

            // add uci-delete class
            button.template.attributes.class.push('ck-uclink');
            return button;
		} );

        editor.ui.componentFactory.add( 'ucUnlink', locale => {
            const button = new ButtonView( locale );

            button.isEnabled = false;
            button.label = t( 'ucUnlink' );
            button.icon = unlinkIcon;
            button.tooltip = true;

            // Bind button to the command.
            button.bind( 'isEnabled' ).to( unlinkCommand, 'isEnabled' );

            // Show the panel on button click.
            this.listenTo( button, 'execute', () => editor.execute( 'ucUnlink' ) );

            // add uci-delete class
            button.template.attributes.class.push('ck-ucunlink');
            return button;
        } );
	}

	/**
	 * Attaches actions that control whether the panel containing the
	 * {@link #formView} is visible or not.
	 *
	 * @private
	 */
	_attachActions() {
		const viewDocument = this.editor.editing.view;

		// // Handle click on view document and show panel when selection is placed inside the link element.
		// // Keep panel open until selection will be inside the same link element.
		// this.listenTo( viewDocument, 'click', () => {
		// 	const parentLink = this._getSelectedLinkElement();
        //
		// 	if ( parentLink ) {
		// 		// Then show panel but keep focus inside editor editable.
		// 		this._showPanel();
		// 	}
		// } );

		// Close the panel on the Esc key press when the editable has focus and the panel is visible.
		this.editor.keystrokes.set( 'Esc', ( data, cancel ) => {
			if (this.editor.isUcLinkDialogOpened ) {
				this._hidePanel();
				cancel();
			}
		} );

		// // Close on click outside of panel element.
		// clickOutsideHandler( {
		// 	callback: () => this._hidePanel()
		// } );
	}

	_showPanel( focusInput ) {
		const editor = this.editor;
		const linkCommand = editor.commands.get( 'ucLink' );
		const unlinkCommand = editor.commands.get( 'ucUnlink' );

		const editing = editor.editing;
		const showViewDocument = editing.view;
		const showIsCollapsed = showViewDocument.selection.isCollapsed;
		const showSelectedLink = this._getSelectedLinkElement();

		this.listenTo( showViewDocument, 'render', () => {
			const renderSelectedLink = this._getSelectedLinkElement();
			const renderIsCollapsed = showViewDocument.selection.isCollapsed;
			const hasSellectionExpanded = showIsCollapsed && !renderIsCollapsed;

			// Hide the panel if:
			//   * the selection went out of the original link element
			//     (e.g. paragraph containing the link was removed),
			//   * the selection has expanded
			// upon the #render event.
			if ( hasSellectionExpanded || showSelectedLink !== renderSelectedLink ) {
				this._hidePanel( true );
			}
		} );

        const fakeEvent = document.createEvent('MouseEvent');
        const fakeTarget = document.querySelector('.ck-uclink');
        const data = {};
        data.href = unlinkCommand.linkHref;
        data.underline = unlinkCommand.linkUnderline;
        data.rel = unlinkCommand.linkRel;
        data.target = unlinkCommand.linkTarget;

        const callbacks = {
        	cancel() {
				alert('cancel');
			},
			save(data) {
                editor.execute( 'ucLink', data );
			}
		};
        editor.owner.openLinkDialog(editor, fakeEvent, fakeTarget, editor.owner, data, callbacks);
        editor.isUcLinkDialogOpened = true;
	}

	_hidePanel( focusEditable ) {
		this.stopListening( this.editor.editing.view, 'render' );

		if ( !this.editor.isUcLinkDialogOpened ) {
			return;
		}

		if ( focusEditable ) {
			this.editor.editing.view.focus();
		}

        this.editor.isUcLinkDialogOpened = false;
		this.stopListening( this.editor.editing.view, 'render' );
	}

	/**
	 * Returns the {@link module:link/linkelement~LinkElement} under
	 * the {@link module:engine/view/document~Document editing view's} selection or `null`
	 * if there is none.
	 *
	 * **Note**: For a non–collapsed selection the `LinkElement` is only returned when **fully**
	 * selected and the **only** element within the selection boundaries.
	 *
	 * @private
	 * @returns {module:link/linkelement~LinkElement|null}
	 */
	_getSelectedLinkElement() {
		const selection = this.editor.editing.view.selection;

		if ( selection.isCollapsed ) {
			return findLinkElementAncestor( selection.getFirstPosition() );
		} else {
			// The range for fully selected link is usually anchored in adjacent text nodes.
			// Trim it to get closer to the actual LinkElement.
			const range = selection.getFirstRange().getTrimmed();
			const startLink = findLinkElementAncestor( range.start );
			const endLink = findLinkElementAncestor( range.end );

			if ( !startLink || startLink != endLink ) {
				return null;
			}

			// Check if the LinkElement is fully selected.
			if ( Range.createIn( startLink ).getTrimmed().isEqual( range ) ) {
				return startLink;
			} else {
				return null;
			}
		}
	}
}

// Returns a `LinkElement` if there's one among the ancestors of the provided `Position`.
//
// @private
// @param {module:engine/view/position~Position} View position to analyze.
// @returns {module:link/linkelement~LinkElement|null} LinkElement at the position or null.
function findLinkElementAncestor( position ) {
	return position.getAncestors().find( ancestor => ancestor instanceof LinkElement );
}
