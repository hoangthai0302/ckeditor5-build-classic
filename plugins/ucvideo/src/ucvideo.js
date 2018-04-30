/**
 * @license Copyright (c) 2018, Ucraft. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module ucvideo/ucvideo
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import UcVideoEditing from './ucvideoediting';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

/**
 * The Video plugin. It introduces the video tag feature.
 *
 * @extends module:core/plugin~Plugin
 */
export default class UcLineHeight extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ UcVideoEditing, Widget ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'UcVideo';
	}
}
