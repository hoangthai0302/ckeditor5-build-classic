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


        // Build converter from model to view for data and editing pipelines.
        buildModelConverter().for( data.modelToView, editing.modelToView )
            .fromAttribute( 'textColor' )
            .toElement( color => {
                const colorElement = new UcColorElement( 'uccolor', {
                    style: `color: ${ color }`
                });
                return colorElement;
            });


        // Build converter from view to model for data pipeline.
        buildViewConverter().for( data.viewToModel )
            .fromElement( 'uccolor' )
            .consuming( { attribute: [ 'style' ] } )
            .toAttribute( viewElement => {
                const color = viewElement.getStyle( 'color' );
                if (color) {
                    return { key: 'textColor', value: viewElement.getStyle( 'color' ) }
                }
            });

		editor.commands.add( 'ucColor', new UcColorCommand( editor, 'textColor' ) );
	}
}
