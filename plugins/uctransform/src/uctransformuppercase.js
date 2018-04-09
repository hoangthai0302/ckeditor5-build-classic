/**
 * @license Copyright (c) 20015-2018, Ucraft. All rights reserved.
 */

/**
 * @module uctransform/uctransformuppercase
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import UctransformUppercaseEditing from './uctransformuppercase/uctransformuppercaseediting';
import UctransformUppercaseUI from './uctransformuppercase/uctransformuppercaseui';

/**
 * The Uctransform uppercase plugin.
 *
 * It enables {@link module:uctransform/uctransformuppercase/uctransformuppercaseediting~UctransformUppercaseEditing} and
 * {@link module:uctransform/uctransformuppercase/uctransformuppercaseui~UctransformUppercaseUI} features in the editor.
 *
 * @extends module:core/plugin~Plugin
 */
export default class UctransformUppercase extends Plugin {
    /**
     * @inheritDoc
     */
    static get requires() {
        return [ UctransformUppercaseEditing, UctransformUppercaseUI ];
    }

    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'UctransformUppercase';
    }
}