/**
 * @license Copyright (c) 2018, Ucraft. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module ucletterspacing/ucletterspacing
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import UcLetterSpacingEditing from './ucletterspacingediting';
import UcLetterSpacingUI from './ucletterspacingui';

/**
 * The letter spacing plugin. It introduces the text letter spacing feature.
 *
 * It loads the Ucraft magic box
 *
 * @extends module:core/plugin~Plugin
 */
export default class UcLetterSpacing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ UcLetterSpacingEditing, UcLetterSpacingUI ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'UcLetterSpacing';
	}
}
