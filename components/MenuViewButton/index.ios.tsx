/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { MenuView } from '@react-native-menu/menu';
import compareVersions from 'compare-versions';
import React, { useCallback, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionSheetIOS, Platform } from 'react-native';
import { Button } from 'react-native-elements';

import type { MenuViewButtonProps } from './types';

const isMenuSupported = !Platform.Version // Version is undefined in tests
	|| compareVersions.compare(String(Platform.Version), '13', '>=');

/**
 * A Button component that opens a MenuView with fallback to Action Sheet for iOS 12.
 */
const MenuViewButton: FC<MenuViewButtonProps> = ({
	disabled,
	...menuProps
}) => {
	const { t } = useTranslation();

	const onPress = useCallback(() => {
		if (isMenuSupported) return;

		ActionSheetIOS.showActionSheetWithOptions(
			{
				options: [
					...menuProps.actions.map(a => a.title),
					t('common.cancel')
				],
				destructiveButtonIndex: menuProps.actions.findIndex(a => a.attributes?.destructive),
				cancelButtonIndex: menuProps.actions.length,
				userInterfaceStyle: menuProps.themeVariant
			},
			index => {
				const action = menuProps.actions[index];
				if (!action) return;

				return menuProps.onPressAction?.({
					nativeEvent: {
						event: action.id || action.title
					}
				});
			}
		);
	}, [ t ]);

	const button = (
		<Button
			type='clear'
			icon={{
				name: 'ellipsis-horizontal',
				type: 'ionicon'
			}}
			disabled={disabled}
			onPress={onPress}
		/>
	);

	if (isMenuSupported) {
		return (
			<MenuView {...menuProps}>
				{button}
			</MenuView>
		);
	}

	return button;
};

MenuViewButton.displayName = 'MenuViewButton';
export default MenuViewButton;
