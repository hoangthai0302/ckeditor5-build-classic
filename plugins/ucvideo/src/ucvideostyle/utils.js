/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module ucvideo/ucvideostyle/utils
 */

import log from '@ckeditor/ckeditor5-utils/src/log';

import fullWidthIcon from '@ckeditor/ckeditor5-core/theme/icons/object-full-width.svg';
import leftIcon from '@ckeditor/ckeditor5-core/theme/icons/object-left.svg';
import centerIcon from '@ckeditor/ckeditor5-core/theme/icons/object-center.svg';
import rightIcon from '@ckeditor/ckeditor5-core/theme/icons/object-right.svg';

/**
 * Default ucvideo styles provided by the plugin that can be referred in the
 * {@link module:ucvideo/ucvideo~UcvideoConfig#styles} configuration.
 *
 * Among them, 2 default semantic content styles are available:
 *
 * * `full` is a full–width ucvideo without any CSS class,
 * * `side` is a side ucvideo styled with the `ucvideo-style-side` CSS class.
 *
 * There are also 3 styles focused on formatting:
 *
 * * `alignLeft` aligns the ucvideo to the left using the `ucvideo-style-align-left` class,
 * * `alignCenter` centers the ucvideo using the `ucvideo-style-align-center` class,
 * * `alignRight` aligns the ucvideo to the right using the `ucvideo-style-align-right` class,
 *
 * @member {Object.<String,Object>}
 */
const defaultStyles = {
	// This option is equal to the situation when no style is applied.
	full: {
		name: 'full',
		title: 'Full size ucvideo',
		icon: fullWidthIcon,
		isDefault: true
	},

	// This represents a side ucvideo.
	side: {
		name: 'side',
		title: 'Side ucvideo',
		icon: rightIcon,
		className: 'ucvideo-style-side'
	},

	// This style represents an ucvideo aligned to the left.
	alignLeft: {
		name: 'alignLeft',
		title: 'Left aligned ucvideo',
		icon: leftIcon,
		className: 'ucvideo-style-align-left'
	},

	// This style represents a centered ucvideo.
	alignCenter: {
		name: 'alignCenter',
		title: 'Centered ucvideo',
		icon: centerIcon,
		className: 'ucvideo-style-align-center'
	},

	// This style represents an ucvideo aligned to the right.
	alignRight: {
		name: 'alignRight',
		title: 'Right aligned ucvideo',
		icon: rightIcon,
		className: 'ucvideo-style-align-right'
	}
};

/**
 * Default ucvideo style icons provided by the plugin that can be referred in the
 * {@link module:ucvideo/ucvideo~UcvideoConfig#styles} configuration.
 *
 * There are 4 icons available: `'full'`, `'left'`, `'center'` and `'right'`.
 *
 * @member {Object.<String, String>}
 */
const defaultIcons = {
	full: fullWidthIcon,
	left: leftIcon,
	right: rightIcon,
	center: centerIcon
};

/**
 * Returns a {@link module:ucvideo/ucvideo~UcvideoConfig#styles} array with items normalized in the
 * {@link module:ucvideo/ucvideostyle/ucvideostyleediting~UcvideoStyleFormat} format and a complete `icon` markup for each style.
 *
 * @returns {Array.<module:ucvideo/ucvideostyle/ucvideostyleediting~UcvideoStyleFormat>}
 */
export function normalizeUcvideoStyles( configuredStyles = [] ) {
	return configuredStyles
		.map( _normalizeStyle )
		.map( style => Object.assign( {}, style ) );
}

// Normalizes an ucvideo style provided in the {@link module:ucvideo/ucvideo~UcvideoConfig#styles}
// and returns it in a {@link module:ucvideo/ucvideostyle/ucvideostyleediting~UcvideoStyleFormat}.
//
// @param {Object} style
// @returns {@link module:ucvideo/ucvideostyle/ucvideostyleediting~UcvideoStyleFormat}
function _normalizeStyle( style ) {
	// Just the name of the style has been passed.
	if ( typeof style == 'string' ) {
		const styleName = style;

		// If it's one of the defaults, just use it.
		if ( defaultStyles[ styleName ] ) {
			// Clone the style to avoid overriding defaults.
			style = Object.assign( {}, defaultStyles[ styleName ] );
		}
		// If it's just a name but none of the defaults, warn because probably it's a mistake.
		else {
			log.warn(
				'ucvideo-style-not-found: There is no such ucvideo style of given name.',
				{ name: styleName }
			);

			// Normalize the style anyway to prevent errors.
			style = {
				name: styleName
			};
		}
	}
	// If an object style has been passed and if the name matches one of the defaults,
	// extend it with defaults – the user wants to customize a default style.
	// Note: Don't override the user–defined style object, clone it instead.
	else if ( defaultStyles[ style.name ] ) {
		const defaultStyle = defaultStyles[ style.name ];
		const extendedStyle = Object.assign( {}, style );

		for ( const prop in defaultStyle ) {
			if ( !style.hasOwnProperty( prop ) ) {
				extendedStyle[ prop ] = defaultStyle[ prop ];
			}
		}

		style = extendedStyle;
	}

	// If an icon is defined as a string and correspond with a name
	// in default icons, use the default icon provided by the plugin.
	if ( typeof style.icon == 'string' && defaultIcons[ style.icon ] ) {
		style.icon = defaultIcons[ style.icon ];
	}

	return style;
}
