import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import buildModelConverter from '@ckeditor/ckeditor5-engine/src/conversion/buildmodelconverter';
import buildViewConverter from '@ckeditor/ckeditor5-engine/src/conversion/buildviewconverter';
import ContainerElement from '@ckeditor/ckeditor5-engine/src/view/containerelement'
import UcColorCommand from './uccolorcommand';
import UcColorElement from './uccolorelement';

export default class ColorEngine extends Plugin {
	init() {
		const editor = this.editor;
		const data = editor.data;
		const editing = editor.editing;

        editor.document.schema.allow( { name: '$inline', attributes: 'textColor', inside: '$block' } );
        // Temporary workaround. See https://github.com/ckeditor/ckeditor5/issues/477.
        editor.document.schema.allow( { name: '$inline', attributes: 'textColor', inside: '$clipboardHolder' } );

        // Build converter from model to view for data and editing pipelines.
        buildModelConverter().for( data.modelToView, editing.modelToView )
            .fromAttribute( 'textColor' )
            .toElement( color => {
                const colorElement = new UcColorElement( 'font', {
                    style: `color: ${ color }`
                });
                return colorElement;
            });

        buildViewConverter()
            .for( data.viewToModel )
            .fromElement('font')
            .fromAttribute( 'style', /color/ )
            .toAttribute( viewElement => {
                const color = viewElement.getStyle( 'color' );

                // Do not convert empty, default or unknown alignment values.
                if ( !color ) {
                    return;
                }

                return { key: 'textColor', value: color };
            } );

		editor.commands.add( 'ucColor', new UcColorCommand( editor, 'textColor' ) );
	}
}
