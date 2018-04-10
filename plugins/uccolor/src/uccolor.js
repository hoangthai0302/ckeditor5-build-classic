/**
 * @license Copyright (c) 2018, Ucraft. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module uccolor/uccolor
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import UcColorEditing from './uccolorediting';
import UcColorUI from './uccolorui';

/**
 * The uccolor plugin. It introduces the text color feature.
 *
 * It loads the Ucraft Color magic box
 *
 * @extends module:core/plugin~Plugin
 */
export default class UcColor extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ UcColorEditing, UcColorUI ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'UcColor';
	}
}
