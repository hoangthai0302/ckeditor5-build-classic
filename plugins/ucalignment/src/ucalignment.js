/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module alignment/alignment
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import UcAlignmentEditing from './ucalignmentediting';
import AlignmentUI from '@ckeditor/ckeditor5-alignment/src/alignmentui';

/**
 * The text alignment plugin.
 *
 * It loads the {@link module:alignment/alignmentediting~AlignmentEditing} and
 * {@link module:alignment/alignmentui~AlignmentUI} plugins.
 *
 * Read more about the feature on the {@glink api/alignment text alignment package} page.
 *
 * @extends module:core/plugin~Plugin
 */
export default class Alignment extends Plugin {
    /**
     * @inheritDoc
     */
    static get requires() {
        return [ UcAlignmentEditing, AlignmentUI ];
    }

    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'Alignment';
    }
}
