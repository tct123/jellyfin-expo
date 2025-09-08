/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useMemo, type FC } from 'react';
import { ListItem } from 'react-native-elements';

import type DownloadModel from '../models/DownloadModel';
import { getItemSubtitle } from '../utils/baseItem';

import DownloadStatusIndicator from './DownloadStatusIndicator';

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
	const subtitle = useMemo(() => item.item && getItemSubtitle(item.item), [ item.item ]);

	const onItemPress = useCallback(() => {
		// Call select callback if in edit mode
		if (isEditMode) onSelect();
		// Otherwise call play callback
		else onPlay();
	}, [ isEditMode, onPlay, onSelect ]);

	return (
		<ListItem
			testID='list-item'
			topDivider={index === 0}
			bottomDivider
			onPress={item.isComplete ? onItemPress : undefined}
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

			<DownloadStatusIndicator
				download={item}
				isEditMode={isEditMode}
				onDelete={onDelete}
				onPlay={onPlay}
			/>
		</ListItem>
	);
};

DownloadListItem.displayName = 'DownloadListItem';
export default DownloadListItem;
