import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import Range from '@ckeditor/ckeditor5-engine/src/view/range';
// import italicIcon from '@ckeditor/ckeditor5-core/theme/icons/picker.svg'
import Model from '@ckeditor/ckeditor5-ui/src/model';
// import createListDropdown from '@ckeditor/ckeditor5-ui/src/dropdown/list/createlistdropdown';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';
import UcColorElement from './uccolorelement';
import UcColorEngine from './uccolorengine';

import ucColorPickerIcon from '../theme/colorwheel.svg';

export default class UcColorColor extends Plugin {

	static get requires() {
		return [ UcColorEngine ];
	}


	static get pluginName() {
		return 'UcColor';
	}

	init() {
		const editor = this.editor;

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

    _showPanel( focusInput ) {
        const editor = this.editor;
        const ucColorCommand = editor.commands.get( 'ucColor' );

        const editing = editor.editing;
        const showViewDocument = editing.view;
        const showIsCollapsed = showViewDocument.selection.isCollapsed;
        const showSelectedUcColor = this._getSelectedUcColorElement();

        this.listenTo( showViewDocument, 'render', () => {
            const renderSelectedLink = this._getSelectedUcColorElement();
            const renderIsCollapsed = showViewDocument.selection.isCollapsed;
            const hasSellectionExpanded = showIsCollapsed && !renderIsCollapsed;

            // Hide the panel if:
            //   * the selection went out of the original link element
            //     (e.g. paragraph containing the link was removed),
            //   * the selection has expanded
            // upon the #render event.
            if ( hasSellectionExpanded || showSelectedUcColor !== renderSelectedLink ) {
                this._hidePanel( true );
            }
        } );

        const fakeEvent = document.createEvent('MouseEvent');
        const fakeTarget = document.querySelector('.ck-uclink');
        const data = {};
        data.color = ucColorCommand.textColor;

        const callback = function(color) {
            editor.execute( 'ucColor', {textColor: color} );
        };

        editor.owner.openColorDialog(editor, fakeEvent, fakeTarget, editor.owner, data, callback);
        editor.isUcColorDialogOpened = true;
    }

    _hidePanel( focusEditable ) {
        this.stopListening( this.editor.editing.view, 'render' );

        if ( !this.editor.isUcColorDialogOpened ) {
            return;
        }

        if ( focusEditable ) {
            this.editor.editing.view.focus();
        }

        this.editor.isUcColorDialogOpened = false;
        this.stopListening( this.editor.editing.view, 'render' );
    }

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

    _attachActions() {
        const viewDocument = this.editor.editing.view;

        // Focus the form if the balloon is visible and the Tab key has been pressed.
        this.editor.keystrokes.set( 'Esc', ( data, cancel ) => {
            if (this.editor.isUcColorDialogOpened ) {
                this._hidePanel();
                cancel();
                return false;
            }
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
