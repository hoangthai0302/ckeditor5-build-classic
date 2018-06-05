/**
 * @license Copyright (c) 2018, Ucraft. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module uclink/uclinkui
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ClickObserver from '@ckeditor/ckeditor5-engine/src/view/observer/clickobserver';
import Range from '@ckeditor/ckeditor5-engine/src/view/range';
import { isLinkElement } from '@ckeditor/ckeditor5-link/src/utils';
import clickOutsideHandler from '@ckeditor/ckeditor5-ui/src/bindings/clickoutsidehandler';
import { ensureSafeUrl } from './utils';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import linkIcon from '../theme/icons/link.svg';
import unlinkIcon from '../theme/icons/unlink.svg';

const linkKeystroke = 'Ctrl+K';

/**
 * The link UI plugin. It introduces the Link and Unlink buttons and the <kbd>Ctrl+K</kbd> keystroke.
 *
 * It uses the Ucraft Link Magic box
 *
 * @extends module:core/plugin~Plugin
 */
export default class UcLinkUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;

		editor.editing.view.addObserver( ClickObserver );

		// Create toolbar buttons.
		this._createToolbarButtons();

		// Attach lifecycle actions to the the balloon.
		this._enableUserBalloonInteractions();
	}

	/**
	 * Creates a toolbar Link button. Clicking this button will show
	 * a {@link #_balloon} attached to the selection.
	 *
	 * @private
	 */
	_createToolbarButtons() {
		const editor = this.editor;
		const ucLinkCommand = editor.commands.get( 'ucLink' );
		const t = editor.t;

		// Handle the `Ctrl+K` keystroke and show the panel.
		editor.keystrokes.set( linkKeystroke, ( keyEvtData, cancel ) => {
			// Prevent focusing the search bar in FF and opening new tab in Edge. #153, #154.
			cancel();

			if ( ucLinkCommand.isEnabled ) {
				this._showUI();
			}
		} );

		editor.ui.componentFactory.add( 'ucLink', locale => {
			const button = new ButtonView( locale );

			button.isEnabled = true;
			button.label = t( 'Link' );
			button.icon = linkIcon;
			button.keystroke = linkKeystroke;
			button.tooltip = true;

			// Bind button to the command.
			button.bind( 'isEnabled' ).to( ucLinkCommand, 'isEnabled' );
            button.bind( 'isVisible' ).to( ucLinkCommand, 'isVisible' );

			// Show the panel on button click.
			this.listenTo( button, 'execute', () => this._showUI() );

            // add uci-delete class
            button.template.attributes.class.push('ck-uclink');

			return button;
		} );


        const ucUnlinkCommand = editor.commands.get( 'ucUnlink' );
        editor.ui.componentFactory.add( 'ucUnlink', locale => {
            const button = new ButtonView( locale );

            button.isEnabled = true;
            button.label = t( 'UnLink' );
            button.icon = unlinkIcon;
            button.tooltip = true;

            // Bind button to the command.
            button.bind( 'isVisible' ).to( ucUnlinkCommand, 'isEnabled' );

            // Show the panel on button click.
            this.listenTo( button, 'execute', () => {
            	editor.execute( 'ucUnlink' )
            } );

            return button;
        } );
	}

	/**
	 * Attaches actions that control whether the balloon panel containing the
	 * {@link #formView} is visible or not.
	 *
	 * @private
	 */
	_enableUserBalloonInteractions() {
		const viewDocument = this.editor.editing.view.document;

		// Handle click on view document and show panel when selection is placed inside the link element.
		// Keep panel open until selection will be inside the same link element.
		this.listenTo( viewDocument, 'click', () => {
			const parentLink = this._getSelectedLinkElement();

			if ( parentLink ) {
				// Then show panel but keep focus inside editor editable.
				this._showUI();
			}
		} );

		// Close the panel on the Esc key press when the editable has focus and the balloon is visible.
		this.editor.keystrokes.set( 'Esc', ( data, cancel ) => {
			if ( this._isUIVisible ) {
				this._hideUI();
				cancel();
			}
		} );

		// Close on click outside of balloon panel element.
		// clickOutsideHandler( {
		// 	emitter: this.formView,
		// 	activator: () => this._isUIVisible,
		// 	contextElements: [  ],
		// 	callback: () => this._hideUI()
		// } );
	}

	/**
	 * Shows the right kind of the UI for current state of the command. It's either
	 * {@link #formView} or {@link #actionsView}.
	 *
	 * @private
	 */
	_showUI() {
		const editor = this.editor;
		const linkCommand = editor.commands.get( 'ucLink' );

		if ( !linkCommand.isEnabled ) {
			return;
		}

        const fakeEvent = document.createEvent('MouseEvent');
        const fakeTarget = document.querySelector('.ck-uclink');
        const data = {};

        const callbacks = {
            cancel() {
            },
            save(data) {
                editor.execute( 'ucLink', ensureSafeUrl( data.linkHref ) );
            }
        };
        editor.owner.openLinkDialog(editor, fakeEvent, fakeTarget, editor.owner, data, callbacks);

        this.ucLinkDialogOpened = true;

		// Begin responding to view#render once the UI is added.
		this._startUpdatingUIOnViewRender();
	}

	/**
	 * Removes the {@link #formView} from the {@link #_balloon}.
	 *
	 * See {@link #_addFormView}, {@link #_addActionsView}.
	 *
	 * @protected
	 */
	_hideUI() {

		const editingView = this.editor.editing.view;

		this.stopListening( editingView, 'render' );

        this.ucLinkDialogOpened = false;
        this.editor.owner.closeLinkDialog(this.editor.owner);
		// Make sure the focus always gets back to the editable.
		editingView.focus();
	}

	/**
	 * Makes the UI react to the {@link module:engine/view/view~View#event:render} in the view to
	 * reposition itself as the document changes.
	 *
	 * See: {@link #_hideUI} to learn when the UI stops reacting to the `render` event.
	 *
	 * @protected
	 */
	_startUpdatingUIOnViewRender() {
		const editor = this.editor;
		const editing = editor.editing;
		const editingView = editing.view;

		let prevSelectedLink = this._getSelectedLinkElement();
		let prevSelectionParent = getSelectionParent();

		this.listenTo( editingView, 'render', () => {
			const selectedLink = this._getSelectedLinkElement();
			const selectionParent = getSelectionParent();

			// Hide the panel if:
			//
			// * the selection went out of the EXISTING link element. E.g. user moved the caret out
			//   of the link,
			// * the selection went to a different parent when creating a NEW link. E.g. someone
			//   else modified the document.
			// * the selection has expanded (e.g. displaying link actions then pressing SHIFT+Right arrow).
			//
			// Note: #_getSelectedLinkElement will return a link for a non-collapsed selection only
			// when fully selected.
			if ( ( prevSelectedLink && !selectedLink ) ||
				( !prevSelectedLink && selectionParent !== prevSelectionParent ) ) {
				this._hideUI();
			}

			prevSelectedLink = selectedLink;
			prevSelectionParent = selectionParent;
		} );

		function getSelectionParent() {
			return editingView.document.selection.focus.getAncestors()
				.reverse()
				.find( node => node.is( 'element' ) );
		}
	}

	/**
	 * Returns true when {@link #actionsView} or {@link #formView} is in the {@link #_balloon} and it is
	 * currently visible.
	 *
	 * @readonly
	 * @protected
	 * @type {Boolean}
	 */
	get _isUIVisible() {
		return this.ucLinkDialogOpened;
	}


	/**
	 * Returns the link {@link module:engine/view/attributeelement~AttributeElement} under
	 * the {@link module:engine/view/document~Document editing view's} selection or `null`
	 * if there is none.
	 *
	 * **Note**: For a non–collapsed selection the link element is only returned when **fully**
	 * selected and the **only** element within the selection boundaries.
	 *
	 * @private
	 * @returns {module:engine/view/attributeelement~AttributeElement|null}
	 */
	_getSelectedLinkElement() {
		const selection = this.editor.editing.view.document.selection;

		if ( selection.isCollapsed ) {
			return findLinkElementAncestor( selection.getFirstPosition() );
		} else {
			// The range for fully selected link is usually anchored in adjacent text nodes.
			// Trim it to get closer to the actual link element.
			const range = selection.getFirstRange().getTrimmed();
			const startLink = findLinkElementAncestor( range.start );
			const endLink = findLinkElementAncestor( range.end );

			if ( !startLink || startLink != endLink ) {
				return null;
			}

			// Check if the link element is fully selected.
			if ( Range.createIn( startLink ).getTrimmed().isEqual( range ) ) {
				return startLink;
			} else {
				return null;
			}
		}
	}
}

// Returns a link element if there's one among the ancestors of the provided `Position`.
//
// @private
// @param {module:engine/view/position~Position} View position to analyze.
// @returns {module:engine/view/attributeelement~AttributeElement|null} Link element at the position or null.
function findLinkElementAncestor( position ) {
	return position.getAncestors().find( ancestor => isLinkElement( ancestor ) );
}
