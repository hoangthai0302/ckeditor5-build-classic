import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ContextualBalloon from '@ckeditor/ckeditor5-ui/src/panel/balloon/contextualballoon';
import clickOutsideHandler from '@ckeditor/ckeditor5-ui/src/bindings/clickoutsidehandler';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import Range from '@ckeditor/ckeditor5-engine/src/view/range';
// import italicIcon from '@ckeditor/ckeditor5-core/theme/icons/picker.svg'
import Model from '@ckeditor/ckeditor5-ui/src/model';
// import createListDropdown from '@ckeditor/ckeditor5-ui/src/dropdown/list/createlistdropdown';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';
import UcColorElement from './uccolorelement';
import UcColorEngine from './uccolorengine';
import UcColorPickerView from './ui/uccolorpickerview';

import ucColorPickerIcon from '../theme/colorwheel.svg';
import '../theme/theme.scss';
import '../lib/color-picker.js';

const fontSymbol = Symbol( 'isFont' );

export default class UcColorColor extends Plugin {

	static get requires() {
		return [ UcColorEngine ];
	}


	static get pluginName() {
		return 'UcColor';
	}

	init() {
		const editor = this.editor;

        /**
         * The form view displayed inside the balloon.
         *
         * @member {module:link/ui/linkformview~LinkFormView}
         */
        this.formView = this._createForm();

        /**
         * The contextual balloon plugin instance.
         *
         * @private
         * @member {module:ui/panel/balloon/contextualballoon~ContextualBalloon}
         */
        this._balloon = editor.plugins.get( ContextualBalloon );

        // Register UI component.
		editor.ui.componentFactory.add( 'ucColor', locale => {
            const view = new ButtonView(locale);

            view.set({
                label: 'Select Color',
                tooltip: true,
                icon: ucColorPickerIcon
            });

            view.on('execute', (e) => {
                this._showPanel(e);
                // editor.execute('ucColor', {color: 'red'});
                // editor.editing.view.focus();
            });


            return view;
        });

        // Attach lifecycle actions to the the balloon.
        this._attachActions();
	}

    /**
     * Creates the {@link module:link/ui/linkformview~LinkFormView} instance.
     *
     * @private
     * @returns {module:link/ui/linkformview~LinkFormView} The link form instance.
     */
    _createForm() {
        const editor = this.editor;
        const formView = new UcColorPickerView( editor.locale );
        const ucColorCommand = editor.commands.get( 'ucColor' );

        formView.textInput.bind( 'value' ).to( ucColorCommand, 'value' );
        //
        // // Form elements should be read-only when corresponding commands are disabled.
        // formView.urlInputView.bind( 'isReadOnly' ).to( linkCommand, 'isEnabled', value => !value );
        // formView.saveButtonView.bind( 'isEnabled' ).to( linkCommand );
        // formView.unlinkButtonView.bind( 'isEnabled' ).to( unlinkCommand );
        //
        // // Execute link command after clicking on formView `Save` button.
        // this.listenTo( formView, 'submit', () => {
        //     editor.execute( 'link', formView.urlInputView.inputView.element.value );
        //     this._hidePanel( true );
        // } );
        //
        // // Execute unlink command after clicking on formView `Unlink` button.
        // this.listenTo( formView, 'unlink', () => {
        //     editor.execute( 'unlink' );
        //     this._hidePanel( true );
        // } );
        //
        // // Hide the panel after clicking on formView `Cancel` button.
        // this.listenTo( formView, 'cancel', () => this._hidePanel( true ) );

        // // Close the panel on esc key press when the form has focus.
        // formView.keystrokes.set( 'Esc', ( data, cancel ) => {
        //     this._hidePanel( true );
        //     cancel();
        // } );

        return formView;
    }

    _showPanel(event) {
        const editor = this.editor;
        const ucColorCommand = editor.commands.get( 'ucColor' );
        const editing = editor.editing;
        const showViewDocument = editing.view;
        const showIsCollapsed = showViewDocument.selection.isCollapsed;
        const showSelectedLink = this._getSelectedUcColorElement();

        this.listenTo( showViewDocument, 'render', () => {
            const renderSelectedLink = this._getSelectedUcColorElement();
            const renderIsCollapsed = showViewDocument.selection.isCollapsed;
            const hasSellectionExpanded = showIsCollapsed && !renderIsCollapsed;

            // Hide the panel if:
            //   * the selection went out of the original link element
            //     (e.g. paragraph containing the link was removed),
            //   * the selection has expanded
            // upon the #render event.
            if ( hasSellectionExpanded || ( showSelectedLink && showSelectedLink !== renderSelectedLink) ) {
                this._hidePanel( true );
            }
            // Update the position of the panel when:
            //  * the selection remains in the original link element,
            //  * there was no link element in the first place, i.e. creating a new link
            else {
                // If still in a link element, simply update the position of the balloon.
                // If there was no link, upon #render, the balloon must be moved
                // to the new position in the editing view (a new native DOM range).
                this._balloon.updatePosition( this._getBalloonPositionData() );
            }
        } , { priority: 'low' } );

        if ( !this._balloon.hasView( this.formView ) ) {
            this._balloon.add( {
                view: this.formView,
                position: this._getBalloonPositionData()
            } );

            this.target = document.querySelector('.ck-uccolorpicker-input');
            this.picker = new CP(this.target, false);

            // prevent showing native color picker panel
            document.querySelector('.ck-uccolorpicker-container').onclick = function(e) {
                e.preventDefault();
            };

            this.picker.on("change", function(color) {
                this.target.value = '#' + color;
                editor.execute( 'ucColor', {color: '#'+color} );
            });

            // add a `static` class to the color picker panel
            this.picker.picker.classList.add('static');
            this.picker.enter(document.querySelector('.ck-uccolorpicker-container'));
        }
        // this.formView.urlInputView.inputView.element.value = ucColorCommand.value || '';
    }

    /**
     * Removes the {@link #formView} from the {@link #_balloon}.
     *
     * See {@link #_showPanel}.
     *
     * @protected
     * @param {Boolean} [focusEditable=false] When `true`, editable focus will be restored on panel hide.
     */
    _hidePanel( focusEditable ) {
        this.stopListening( this.editor.editing.view, 'render' );

        if ( !this._balloon.hasView( this.formView ) ) {
            return;
        }

        if ( focusEditable ) {
            this.editor.editing.view.focus();
        }

        if (document.querySelector('.ck-uccolorpicker-container')) {
            document.querySelector('.ck-uccolorpicker-container').innerHTML = '';
        }

        this.stopListening( this.editor.editing.view, 'render' );
        this._balloon.remove( this.formView );
    }

    /**
     * Returns positioning options for the {@link #_balloon}. They control the way the balloon is attached
     * to the target element or selection.
     *
     * If the selection is collapsed and inside a link element, the panel will be attached to the
     * entire link element. Otherwise, it will be attached to the selection.
     *
     * @private
     * @returns {module:utils/dom/position~Options}
     */
    _getBalloonPositionData() {
        const viewDocument = this.editor.editing.view;
        const targetLink = this._getSelectedUcColorElement();

        const target = targetLink ?
            // When selection is inside link element, then attach panel to this element.
            viewDocument.domConverter.mapViewToDom( targetLink ) :
            // Otherwise attach panel to the selection.
            viewDocument.domConverter.viewRangeToDom( viewDocument.selection.getFirstRange() );

        return { target };
    }

    /**
     * Returns the {@link module:link/UcColorElement~UcColorElement} under
     * the {@link module:engine/view/document~Document editing view's} selection or `null`
     * if there is none.
     *
     * **Note**: For a non–collapsed selection the `UcColorElement` is only returned when **fully**
     * selected and the **only** element within the selection boundaries.
     *
     * @private
     * @returns {module:link/UcColorElement~UcColorElement|null}
     */
    _getSelectedUcColorElement() {
        const selection = this.editor.editing.view.selection;
        if ( selection.isCollapsed ) {
            return findUcColorElementAncestor( selection.getFirstPosition() );
        } else {
            // The range for fully selected link is usually anchored in adjacent text nodes.
            // Trim it to get closer to the actual UcColorElement.
            const range = selection.getFirstRange().getTrimmed();
            const startLink = findUcColorElementAncestor( range.start );
            const endLink = findUcColorElementAncestor( range.end );

            if ( !startLink || startLink != endLink ) {
                return null;
            }

            // Check if the UcColorElement is fully selected.
            if ( Range.createIn( startLink ).getTrimmed().isEqual( range ) ) {
                return startLink;
            } else {
                return null;
            }
        }
    }

    /**
     * Attaches actions that control whether the balloon panel containing the
     * {@link #formView} is visible or not.
     *
     * @private
     */
    _attachActions() {
        const viewDocument = this.editor.editing.view;

        // // Handle click on view document and show panel when selection is placed inside the link element.
        // // Keep panel open until selection will be inside the same link element.
        // this.listenTo( viewDocument, 'click', () => {
        //     const parentLink = this._getSelectedUcColorElement();
        //
        //     if ( parentLink ) {
        //         // Then show panel but keep focus inside editor editable.
        //         this._showPanel();
        //     }
        // } );

        // Focus the form if the balloon is visible and the Tab key has been pressed.
        this.editor.keystrokes.set( 'Tab', ( data, cancel ) => {
            if ( this._balloon.visibleView === this.formView && !this.formView.focusTracker.isFocused ) {
                this.formView.focus();
                cancel();
            }
        }, {
            // Use the high priority because the link UI navigation is more important
            // than other feature's actions, e.g. list indentation.
            // https://github.com/ckeditor/ckeditor5-link/issues/146
            priority: 'high'
        } );

        // Close the panel on the Esc key press when the editable has focus and the balloon is visible.
        this.editor.keystrokes.set( 'Esc', ( data, cancel ) => {
            if ( this._balloon.visibleView === this.formView ) {
                this._hidePanel();
                cancel();
            }
        } );

        // Close on click outside of balloon panel element.
        clickOutsideHandler( {
            emitter: this.formView,
            activator: () => this._balloon.hasView( this.formView ),
            contextElements: [ this._balloon.view.element ],
            callback: () => this._hidePanel()
        } );
    }
}
function getCommandsBindingTargets( commands, attribute ) {
	return Array.prototype.concat( ...commands.map( c => [ c, attribute ] ) );
}

// Returns a `UcColorElement` if there's one among the ancestors of the provided `Position`.
//
// @private
// @param {module:engine/view/position~Position} View position to analyze.
// @returns {module:link/UcColorElement~UcColorElement|null} UcColorElement at the position or null.
function findUcColorElementAncestor( position ) {
    return position.getAncestors().find( ancestor => ancestor instanceof UcColorElement );
}
