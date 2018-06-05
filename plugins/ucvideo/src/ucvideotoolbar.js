/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module ucvideo/ucvideotoolbar
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ToolbarView from '@ckeditor/ckeditor5-ui/src/toolbar/toolbarview';
import ContextualBalloon from '@ckeditor/ckeditor5-ui/src/panel/balloon/contextualballoon';
import { isUcvideoWidgetSelected } from './ucvideo/utils';
import { repositionContextualBalloon, getBalloonPositionData } from './ucvideo/ui/utils';

const balloonClassName = 'ck-video-toolbar-container';

/**
 * The ucvideo toolbar class. Creates an ucvideo toolbar that shows up when the ucvideo widget is selected.
 *
 * Toolbar components are created using the editor {@link module:ui/componentfactory~ComponentFactory ComponentFactory}
 * based on the {@link module:core/editor/editor~Editor#config configuration} stored under `ucvideo.toolbar`.
 *
 * The toolbar uses the {@link module:ui/panel/balloon/contextualballoon~ContextualBalloon}.
 *
 * For a detailed overview, check the {@glink features/ucvideo#ucvideo-contextual-toolbar ucvideo contextual toolbar} documentation.
 *
 * @extends module:core/plugin~Plugin
 */
export default class UcvideoToolbar extends Plugin {
    /**
     * @inheritDoc
     */
    static get requires() {
        return [ ContextualBalloon ];
    }

    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'UcvideoToolbar';
    }

    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;
        const balloonToolbar = editor.plugins.get( 'BalloonToolbar' );

        // If the `BalloonToolbar` plugin is loaded, it should be disabled for ucvideos
        // which have their own toolbar to avoid duplication.
        // https://github.com/ckeditor/ckeditor5-ucvideo/issues/110
        if ( balloonToolbar ) {
            this.listenTo( balloonToolbar, 'show', evt => {
                if ( isUcvideoWidgetSelected( editor.editing.view.document.selection ) ) {
                    evt.stop();
                }
            }, { priority: 'high' } );
        }
    }

    /**
     * @inheritDoc
     */
    afterInit() {
        const editor = this.editor;
        const toolbarConfig = editor.config.get( 'ucvideo.toolbar' );

        // Don't add the toolbar if there is no configuration.
        if ( !toolbarConfig || !toolbarConfig.length ) {
            return;
        }

        /**
         * A contextual balloon plugin instance.
         *
         * @private
         * @member {module:ui/panel/balloon/contextualballoon~ContextualBalloon}
         */
        this._balloon = this.editor.plugins.get( 'ContextualBalloon' );

        /**
         * A `ToolbarView` instance used to display the buttons specific for ucvideo editing.
         *
         * @protected
         * @type {module:ui/toolbar/toolbarview~ToolbarView}
         */
        this._toolbar = new ToolbarView();

        // Add buttons to the toolbar.
        this._toolbar.fillFromConfig( toolbarConfig, editor.ui.componentFactory );

        // Show balloon panel each time ucvideo widget is selected.
        this.listenTo( editor.editing.view, 'render', () => {
            this._checkIsVisible();
        } );

        // There is no render method after focus is back in editor, we need to check if balloon panel should be visible.
        this.listenTo( editor.ui.focusTracker, 'change:isFocused', () => {
            this._checkIsVisible();
        }, { priority: 'low' } );
    }

    /**
     * Checks whether the toolbar should show up or hide depending on the current selection.
     *
     * @private
     */
    _checkIsVisible() {
        const editor = this.editor;

        if ( !editor.ui.focusTracker.isFocused ) {
            this._hideToolbar();
        } else {
            if ( isUcvideoWidgetSelected( editor.editing.view.document.selection ) ) {
                this._showToolbar();
            } else {
                this._hideToolbar();
            }
        }
    }

    /**
     * Shows the {@link #_toolbar} in the {@link #_balloon}.
     *
     * @private
     */
    _showToolbar() {
        const editor = this.editor;

        if ( this._isVisible ) {
            repositionContextualBalloon( editor );
        } else {
            if ( !this._balloon.hasView( this._toolbar ) ) {
                this._balloon.add( {
                    view: this._toolbar,
                    position: getBalloonPositionData( editor ),
                    balloonClassName
                } );
            }
        }
    }

    /**
     * Removes the {@link #_toolbar} from the {@link #_balloon}.
     *
     * @private
     */
    _hideToolbar() {
        if ( !this._isVisible ) {
            return;
        }

        this._balloon.remove( this._toolbar );
    }

    /**
     * Returns `true` when the {@link #_toolbar} is the visible view in the {@link #_balloon}.
     *
     * @private
     * @type {Boolean}
     */
    get _isVisible() {
        return this._balloon.visibleView == this._toolbar;
    }
}

/**
 * Items to be placed in the ucvideo toolbar.
 * This option is used by the {@link module:ucvideo/ucvideotoolbar~UcvideoToolbar} feature.
 *
 * Assuming that you use the following features:
 *
 * * {@link module:ucvideo/ucvideostyle~UcvideoStyle} (with a default configuration),
 * * {@link module:ucvideo/ucvideotextalternative~UcvideoTextAlternative},
 *
 * three toolbar items will be available in {@link module:ui/componentfactory~ComponentFactory}:
 * `'ucvideoStyle:full'`, `'ucvideoStyle:side'`, and `'ucvideoTextAlternative'` so you can configure the toolbar like this:
 *
 *		const ucvideoConfig = {
 *			toolbar: [ 'ucvideoStyle:full', 'ucvideoStyle:side', '|', 'ucvideoTextAlternative' ]
 *		};
 *
 * Of course, the same buttons can also be used in the
 * {@link module:core/editor/editorconfig~EditorConfig#toolbar main editor toolbar}.
 *
 * Read more about configuring toolbar in {@link module:core/editor/editorconfig~EditorConfig#toolbar}.
 *
 * @member {Array.<String>} module:ucvideo/ucvideo~UcvideoConfig#toolbar
 */
