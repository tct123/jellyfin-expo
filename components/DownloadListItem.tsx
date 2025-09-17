/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { MediaType } from '@jellyfin/sdk/lib/generated-client/models/media-type';
import React, { useCallback, useMemo, type FC } from 'react';
import { ListItem } from 'react-native-elements';

import type DownloadModel from '../models/DownloadModel';
import { getItemSubtitle } from '../utils/baseItem';

import DownloadStatusIndicator from './DownloadStatusIndicator';

interface DownloadListItemProps {
	item: DownloadModel;
	index: number;
	onSelect: () => void;
	onOpen: () => void;
	onPlay: () => void;
	onDelete: () => void;
	isEditMode?: boolean;
	isSelected?: boolean;
}

const DownloadListItem: FC<DownloadListItemProps> = ({
	item,
	index,
	onSelect,
	onOpen,
	onPlay,
	onDelete,
	isEditMode = false,
	isSelected = false
}) => {
	// NOTE: Currently only video has a native UI to play within the app.
	// The media type check should be removed when we have a native audio player UI available.
	const canPlayInApp = useMemo(() => (
		item.canPlay && item.item.MediaType === MediaType.Video
	), [ item.canPlay, item.item.MediaType ]);
	const subtitle = useMemo(() => getItemSubtitle(item.item), [ item.item ]);

	const onItemPress = useCallback(() => {
		// Call select callback if in edit mode
		if (isEditMode) onSelect();
		// Call play if item is playable in app
		else if (canPlayInApp) onPlay();
		// Otherwise open the item
		else onOpen();
	}, [ canPlayInApp, isEditMode, onOpen, onPlay, onSelect ]);

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
				canPlayInApp={canPlayInApp}
				isEditMode={isEditMode}
				onDelete={onDelete}
				onOpen={onOpen}
				onPlay={onPlay}
			/>
		</ListItem>
	);
};

DownloadListItem.displayName = 'DownloadListItem';
export default DownloadListItem;
