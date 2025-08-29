/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { MenuView, type NativeActionEvent } from '@react-native-menu/menu';
import React, { useCallback, useMemo, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'react-native';
import { Button, ListItem } from 'react-native-elements';

import type DownloadModel from '../models/DownloadModel';

interface DownloadListItemProps {
	item: DownloadModel;
	index: number;
	onSelect: () => void;
	onPlay: () => void;
	onDelete: () => void;
	isEditMode?: boolean;
	isSelected?: boolean;
}

const DownloadListItem: FC<DownloadListItemProps> = ({
	item,
	index,
	onSelect,
	onPlay,
	onDelete,
	isEditMode = false,
	isSelected = false
}) => {
	const { t } = useTranslation();

	const menuActions = useMemo(() => [
		{
			id: 'play_in_app',
			title: t('common.play'),
			image: 'play'
		},
		{
			id: 'delete',
			title: t('common.delete'),
			attributes: {
				destructive: true
			},
			image: 'trash'
		}
	], [ t ]);

	const onMenuPress = useCallback(({ nativeEvent }: NativeActionEvent) => {
		switch (nativeEvent.event) {
			case 'play_in_app':
				return onPlay();
			case 'delete':
				return onDelete();
		}
	}, [ onDelete, onPlay ]);

	return (
		<ListItem
			testID='list-item'
			topDivider={index === 0}
			bottomDivider
			onPress={() => {
				if (isEditMode) onSelect();
				else onPlay();
			}}
		>
			{isEditMode &&
			<ListItem.CheckBox
				testID='select-checkbox'
				onPress={onSelect}
				checked={isSelected}
				accessibilityRole='checkbox'
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
					{item.localFilename}
				</ListItem.Subtitle>
			</ListItem.Content>
			{item.isComplete ? (
				<MenuView
					testID='menu-view'
					actions={menuActions}
					onPressAction={onMenuPress}
					shouldOpenOnLongPress={false}
					themeVariant='dark'
				>
					<Button
						testID='menu-button'
						type='clear'
						icon={{
							name: 'ellipsis-horizontal',
							type: 'ionicon'
						}}
						disabled={isEditMode}
					/>
				</MenuView>
			) :
				<ActivityIndicator testID='loading-indicator' />
			}
		</ListItem>
	);
};

DownloadListItem.displayName = 'DownloadListItem';

export default DownloadListItem;
