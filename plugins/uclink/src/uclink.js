/**
 * @license Copyright (c) 2018, Ucraft. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module uclink/uclink
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import UcLinkEditing from './uclinkediting';
import UcLinkUI from './uclinkui';

/**
 * The uclink plugin. It introduces the Link and Unlink buttons and the <kbd>Ctrl+K</kbd> keystroke.
 *
 * It loads the Ucraft Link magic box
 *
 * @extends module:core/plugin~Plugin
 */
export default class UcLink extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ UcLinkEditing, UcLinkUI ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'UcLink';
	}
}
