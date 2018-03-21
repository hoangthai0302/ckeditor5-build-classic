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