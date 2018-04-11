/**
 * @license Copyright (c) 2018, Ucraft. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module uclineheight/uclineheight
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import UcLineHeightEditing from './uclineheightediting';
import UcLineHeightUI from './uclineheightui';

/**
 * The line height plugin. It introduces the text letter spacing feature.
 *
 * It loads the Ucraft magic box
 *
 * @extends module:core/plugin~Plugin
 */
export default class UcLineHeight extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ UcLineHeightEditing, UcLineHeightUI ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'UcLineHeight';
	}
}
