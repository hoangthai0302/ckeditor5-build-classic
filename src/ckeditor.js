/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials';
import UploadadapterPlugin from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
import AutoformatPlugin from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold';
import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic';
import UnderlinePlugin from '@ckeditor/ckeditor5-basic-styles/src/underline';
import CodePlugin from '@ckeditor/ckeditor5-basic-styles/src/code';
import BlockquotePlugin from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import EasyimagePlugin from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import HeadingPlugin from '@ckeditor/ckeditor5-heading/src/heading';
import ImagePlugin from '@ckeditor/ckeditor5-image/src/image';
import ImagecaptionPlugin from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImagestylePlugin from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImagetoolbarPlugin from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ListPlugin from '@ckeditor/ckeditor5-list/src/list';
import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import ImageuploadPlugin from '@ckeditor/ckeditor5-upload/src/imageupload';
import AutoFormatPlugin from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import GFMDataProcessor from '@ckeditor/ckeditor5-markdown-gfm/src/gfmdataprocessor';


// Simple plugin which loads the data processor.
function Markdown( editor ) {
    editor.data.processor = new GFMDataProcessor();
}

/* Ucraft Plugins */
import UcMediaPlugin from '../plugins/ucmedia/src/ucmedia';
import UcLinkPlugin from '../plugins/uclink/src/uclink';


export default class ClassicEditor extends ClassicEditorBase {}

import '../theme/style.scss';

ClassicEditor.build = {
	plugins: [
		EssentialsPlugin,
		UploadadapterPlugin,
		AutoformatPlugin,
		BoldPlugin,
		ItalicPlugin,
        UnderlinePlugin,
        CodePlugin,
		BlockquotePlugin,
		EasyimagePlugin,
		HeadingPlugin,
		ImagePlugin,
		ImagecaptionPlugin,
		ImagestylePlugin,
		ImagetoolbarPlugin,
		// LinkPlugin,
		ListPlugin,
		ParagraphPlugin,
		ImageuploadPlugin,
        UcMediaPlugin,
        AutoFormatPlugin,
        UcLinkPlugin
	],
	config: {
		toolbar: {
			items: [
				'headings',
                'bold',
                'italic',
                'underline',
				'code',
				'|',
                'blockQuote',
				// 'link',
				'ucLink',
                'ucUnlink',
				'|',
				'bulletedList',
				'numberedList',
				'|',
				'undo',
				'redo',
				'|',
				'ucMedia'
			]
		},
		image: {
            toolbar: [ 'imageTextAlternative', '|', 'imageStyleAlignLeft', 'imageStyleFull', 'imageStyleAlignRight' ],

            styles: [
                // This option is equal to a situation where no style is applied.
                'imageStyleFull',

                // This represents an image aligned to left.
                'imageStyleAlignLeft',

                // This represents an image aligned to right.
                'imageStyleAlignRight'
            ]
		},
        heading:  {
            options: [
                { modelElement: 'paragraph', title: 'P', class: 'ck-heading_paragraph' },
                { modelElement: 'heading1', viewElement: 'h1', title: 'H1', class: 'ck-heading_heading1' },
                { modelElement: 'heading2', viewElement: 'h2', title: 'H2', class: 'ck-heading_heading2' },
                { modelElement: 'heading3', viewElement: 'h3', title: 'H3', class: 'ck-heading_heading3' },
                { modelElement: 'heading4', viewElement: 'h4', title: 'H4', class: 'ck-heading_heading4' },
                { modelElement: 'heading5', viewElement: 'h5', title: 'H5', class: 'ck-heading_heading5' },
                { modelElement: 'heading6', viewElement: 'h6', title: 'H6', class: 'ck-heading_heading6' }
            ]
        }
	}
};
