import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
// import italicIcon from '@ckeditor/ckeditor5-core/theme/icons/picker.svg'
import Model from '@ckeditor/ckeditor5-ui/src/model';
// import createListDropdown from '@ckeditor/ckeditor5-ui/src/dropdown/list/createlistdropdown';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';
import UcColorEngine from './uccolorengine';

export default class UcColorColor extends Plugin {

	static get requires() {
		return [ UcColorEngine ];
	}


	static get pluginName() {
		return 'UcColor';
	}

	init() {
		const editor = this.editor;

		// Register UI component.
		editor.ui.componentFactory.add( 'ucColor', locale => {
            const view = new ButtonView(locale);

            view.set({
                label: 'Select image from Media Manager',
                tooltip: true
            });

            view.on('execute', () => {
                editor.execute('ucColor', {color: 'red'});
                editor.editing.view.focus();
            });

            return view;
        });
	}

}
function getCommandsBindingTargets( commands, attribute ) {
	return Array.prototype.concat( ...commands.map( c => [ c, attribute ] ) );
}
