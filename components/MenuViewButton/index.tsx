/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { MenuView } from '@react-native-menu/menu';
import React, { useContext, type FC } from 'react';
import { ListItem, ThemeContext } from 'react-native-elements';

import type { MenuViewButtonProps } from './types';

/**
 * A Button component that opens a MenuView with fallback to Action Sheet for iOS 12.
 */
const MenuViewButton: FC<MenuViewButtonProps> = ({
	disabled,
	...menuProps
}) => {
	const { theme } = useContext(ThemeContext);

	return (
		<MenuView {...menuProps}>
			<ListItem.Chevron
				name='ellipsis-horizontal'
				type='ionicon'
				color={theme.colors?.black}
				disabled={disabled}
				onPress={() => { /* no-op */ }}
			/>
		</MenuView>
	);
};

MenuViewButton.displayName = 'MenuViewButton';
export default MenuViewButton;
