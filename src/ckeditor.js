/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials';
import UploadadapterPlugin from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
import AutoformatPlugin from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold';
import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic';
import BlockquotePlugin from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import EasyimagePlugin from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import HeadingPlugin from '@ckeditor/ckeditor5-heading/src/heading';
import ImagePlugin from '@ckeditor/ckeditor5-image/src/image';
import ImagecaptionPlugin from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImagestylePlugin from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImagetoolbarPlugin from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import LinkPlugin from '@ckeditor/ckeditor5-link/src/link';
import ListPlugin from '@ckeditor/ckeditor5-list/src/list';
import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph';


import StrikethroughPlugin from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import CodePlugin from '@ckeditor/ckeditor5-basic-styles/src/code';
import FontPlugin from '@ckeditor/ckeditor5-font/src/font';


export default class ClassicEditor extends ClassicEditorBase {}

ClassicEditor.build = {
	plugins: [
		EssentialsPlugin,
		UploadadapterPlugin,
		AutoformatPlugin,
		BoldPlugin,
		ItalicPlugin,
		BlockquotePlugin,
		EasyimagePlugin,
		HeadingPlugin,
		ImagePlugin,
		ImagecaptionPlugin,
		ImagestylePlugin,
		ImagetoolbarPlugin,
		LinkPlugin,
		ListPlugin,
		ParagraphPlugin,
        StrikethroughPlugin,
        CodePlugin,
        FontPlugin
	],
	config: {
		toolbar: {
			items: [
				'heading',
				'|',
				'bold',
				'italic',
				'strikethrough',
				'code',
				'|',
                'fontFamily',
				'fontSize',
				'|',
				'link',
				'bulletedList',
				'numberedList',
				'blockQuote',
				'undo',
				'redo'
			]
		},
		image: {
            toolbar: [ 'imageTextAlternative', '|', 'imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:alignRight' ],
            styles: [
                'full',
                'alignLeft',
                'alignRight'
            ]
		},
		heading: {
            options: [
            	{ model: 'paragraph', title: 'P', class: 'ck-heading_paragraph' },
            	{ model: 'heading2', view: 'h2', title: 'H2', class: 'ck-heading_heading2' },
            	{ model: 'heading3', view: 'h3', title: 'H3', class: 'ck-heading_heading3' },
            	{ model: 'heading4', view: 'h4', title: 'H4', class: 'ck-heading_heading4' },
                { model: 'heading5', view: 'h5', title: 'H5', class: 'ck-heading_heading5' },
                { model: 'heading6', view: 'h6', title: 'H6', class: 'ck-heading_heading6' }
			]
		},
        fontFamily: {
            options: [
                'default',
                'Ubuntu, Arial, sans-serif',
                'Ubuntu Mono, Courier New, Courier, monospace'
            ]
        },
        fontSize: {
            options: [
                9,
                11,
                13,
                'normal',
                17,
                19,
                21
            ]
        },
		language: 'en'
	}
};
