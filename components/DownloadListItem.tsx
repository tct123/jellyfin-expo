/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useMemo, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'react-native';
import { ListItem } from 'react-native-elements';

import { useStores } from '../hooks/useStores';
import type DownloadModel from '../models/DownloadModel';
import { getItemSubtitle } from '../utils/baseItem';

import MenuViewButton from './MenuViewButton';
import type { MenuPressEvent } from './MenuViewButton/types';

interface DownloadListItemProps {
	item: DownloadModel;
	index: number;
	onSelect: () => void;
	onPlay: () => void;
	onDelete: () => void;
	isEditMode?: boolean;
	isSelected?: boolean;
}

const MenuAction = {
	Delete: 'delete',
	PlayInApp: 'play_in_app'
} as const;

const DownloadListItem: FC<DownloadListItemProps> = ({
	item,
	index,
	onSelect,
	onPlay,
	onDelete,
	isEditMode = false,
	isSelected = false
}) => {
	const { settingStore } = useStores();
	const { t } = useTranslation();

	const menuActions = useMemo(() => [
		{
			id: MenuAction.PlayInApp,
			title: t('common.play'),
			image: 'play'
		},
		{
			id: MenuAction.Delete,
			title: t('common.delete'),
			attributes: {
				destructive: true
			},
			image: 'trash'
		}
	], [ t ]);

	const subtitle = useMemo(() => item.item && getItemSubtitle(item.item), [ item.item ]);

	const onItemPress = useCallback(() => {
		// Call select callback if in edit mode
		if (isEditMode) onSelect();
		// Otherwise call play callback
		else onPlay();
	}, [ isEditMode, onPlay, onSelect ]);

	const onMenuPress = useCallback(({ nativeEvent }: MenuPressEvent) => {
		switch (nativeEvent.event) {
			case MenuAction.PlayInApp:
				return onPlay();
			case MenuAction.Delete:
				return onDelete();
			default:
				console.warn('[DownloadListItem.onMenuPress] unhandled menu press action', nativeEvent.event);
		}
	}, [ onDelete, onPlay ]);

	return (
		<ListItem
			testID='list-item'
			topDivider={index === 0}
			bottomDivider
			onPress={item.isComplete ? onItemPress : undefined}
			accessibilityState={{ disabled: !item.isComplete }}
		>
			{isEditMode &&
				<ListItem.CheckBox
					testID='select-checkbox'
					onPress={onSelect}
					checked={isSelected}
					disabled={!item.isComplete}
					accessibilityRole='checkbox'
					accessibilityState={{ checked: isSelected, disabled: !item.isComplete }}
				/>
			}
			<ListItem.Content>
				<ListItem.Title
					testID='title'
					numberOfLines={1}
					ellipsizeMode='tail'
				>
					{item.title}
				</ListItem.Title>
				<ListItem.Subtitle
					testID='subtitle'
					numberOfLines={1}
					ellipsizeMode='tail'
				>
					{subtitle || item.localFilename}
				</ListItem.Subtitle>
			</ListItem.Content>
			{item.isComplete ? (
				<MenuViewButton
					testID='menu-view'
					actions={menuActions}
					onPressAction={onMenuPress}
					shouldOpenOnLongPress={false}
					themeVariant={
						settingStore.getTheme().dark ? 'dark' : 'light'
					}
					disabled={isEditMode}
				/>
			) :
				<ActivityIndicator testID='loading-indicator' />
			}
		</ListItem>
	);
};

DownloadListItem.displayName = 'DownloadListItem';

export default DownloadListItem;
