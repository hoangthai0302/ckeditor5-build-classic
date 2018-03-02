
import Command from '@ckeditor/ckeditor5-core/src/command';

export default class AttributeCommand extends Command {

	constructor( editor, attributeKey ) {
		super( editor );


		this.attributeKey = attributeKey;
	}

	/**
	 * Updates the command's {@link #value} and {@link #isEnabled} based on the current selection.
	 */
	refresh() {
		const doc = this.editor.document;
		this.value = doc.selection.hasAttribute(this.attributeKey);
		this.isEnabled = true
	}

	execute( options = {} ) {
		const doc = this.editor.document;
		const selection = doc.selection;
		const value = options.color;

        doc.enqueueChanges( () => {
            if ( selection.isCollapsed ) {
                if ( value ) {
                    selection.setAttribute( this.attributeKey, true );
                } else {
                    selection.removeAttribute( this.attributeKey );
                }
            } else {
                const ranges = doc.schema.getValidRanges( selection.getRanges(), this.attributeKey );
                const batch = options.batch || doc.batch();

                for ( const range of ranges ) {
                    if ( value ) {
                        batch.setAttribute( range, this.attributeKey, value );
                    } else {
                        batch.removeAttribute( range, this.attributeKey );
                    }
                }
            }
        } );
	}
}
