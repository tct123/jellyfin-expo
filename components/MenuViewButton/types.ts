/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { MenuComponentProps, NativeActionEvent } from '@react-native-menu/menu';

/** Event that is fired when a menu item is pressed. */
export type MenuPressEvent = NativeActionEvent;

export interface MenuViewButtonProps extends MenuComponentProps {
	/** A narrowed type for MenuView and ActionSheet theming that only allows supported values. */
	themeVariant?: 'light' | 'dark';
	/** Disable the button (and effectively the menu). */
	disabled?: boolean;
}
