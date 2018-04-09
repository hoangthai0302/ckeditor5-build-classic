/**
 * @license Copyright (c) 20015-2018, Ucraft. All rights reserved.
 */

/**
 * @module uctransform/uctransform
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import UctransformUppercase from './uctransformuppercase';

/**
 * A plugin that enables (aggregates) a set of text styling features:
 * * {@link module:uctransform/uctransformuppercase~UctransformUppercase},
 *
 *
 * @extends module:core/plugin~Plugin
 */
export default class Uctransform extends Plugin {
    /**
     * @inheritDoc
     */
    static get requires() {
        return [ UctransformUppercase ];
    }

    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'Uctransform';
    }
}
