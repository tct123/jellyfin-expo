/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { MediaType } from '@jellyfin/sdk/lib/generated-client/models/media-type';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import DownloadModel from '../../../../models/DownloadModel';
import { DownloadStatus } from '../../constants/DownloadStatus';
import DownloadListItem from '../DownloadListItem';

describe('DownloadListItem', () => {
	let model;

	beforeEach(() => {
		jest.resetModules();

		model = new DownloadModel(
			{
				Id: 'item-id',
				ServerId: 'server-id',
				Name: 'title',
				MediaType: MediaType.Video
			},
			'https://example.com/',
			'api-key',
			'file name.mkv',
			'https://example.com/download'
		);
	});

	it('should render correctly', () => {
		const onPlay = jest.fn();
		const onSelect = jest.fn();

		model.status = DownloadStatus.Downloading;

		const { getByTestId, queryByTestId } = render(
			<DownloadListItem
				item={model}
				index={0}
				onSelect={onSelect}
				onOpen={jest.fn()}
				onPlay={onPlay}
				onDelete={jest.fn()}
			/>
		);

		expect(queryByTestId('select-checkbox')).toBeNull();
		expect(queryByTestId('failed-icon')).toBeNull();

		expect(getByTestId('title')).toHaveTextContent('title');
		expect(getByTestId('subtitle')).toHaveTextContent('file name.mp4');

		expect(queryByTestId('loading-indicator')).not.toBeNull();
	});

	it('should display the menu and handle presses', () => {
		const onDelete = jest.fn();
		const onOpen = jest.fn();
		const onPlay = jest.fn();

		model.canPlay = true;
		model.status = DownloadStatus.Complete;

		const { getByTestId, queryByTestId } = render(
			<DownloadListItem
				item={model}
				index={0}
				onSelect={jest.fn()}
				onOpen={onOpen}
				onPlay={onPlay}
				onDelete={onDelete}
			/>
		);

		expect(queryByTestId('select-checkbox')).toBeNull();
		expect(queryByTestId('failed-icon')).toBeNull();

		expect(getByTestId('title')).toHaveTextContent('title');
		expect(getByTestId('subtitle')).toHaveTextContent('file name.mp4');

		expect(queryByTestId('loading-indicator')).toBeNull();

		// Pressing the list item should call onPlay when not editing
		expect(onPlay).not.toHaveBeenCalled();
		fireEvent.press(getByTestId('list-item'));
		expect(onPlay).toHaveBeenCalledTimes(1);
		// Pressing the play menu action should call onPlay
		expect(queryByTestId('play_in_app')).not.toBeNull();
		fireEvent.press(getByTestId('play_in_app'));
		expect(onPlay).toHaveBeenCalledTimes(2);
		// Pressing the open menu action should call onOpen
		expect(onOpen).not.toHaveBeenCalled();
		expect(queryByTestId('open_in_files')).not.toBeNull();
		fireEvent.press(getByTestId('open_in_files'));
		expect(onOpen).toHaveBeenCalled();
		// Pressing the delete menu action should call onDelete
		expect(onDelete).not.toHaveBeenCalled();
		expect(queryByTestId('delete')).not.toBeNull();
		fireEvent.press(getByTestId('delete'));
		expect(onDelete).toHaveBeenCalled();
	});

	it('should call onOpen if the item is pressed and not playable', () => {
		const onOpen = jest.fn();

		model.status = DownloadStatus.Complete;

		const { getByTestId } = render(
			<DownloadListItem
				item={model}
				index={0}
				onSelect={jest.fn()}
				onOpen={onOpen}
				onPlay={jest.fn()}
				onDelete={jest.fn()}
			/>
		);

		// Pressing the list item should call onOpen when not playable
		expect(onOpen).not.toHaveBeenCalled();
		fireEvent.press(getByTestId('list-item'));
		expect(onOpen).toHaveBeenCalled();
	});

	it('should display the select checkbox and handle presses', () => {
		const onSelect = jest.fn();

		model.status = DownloadStatus.Complete;

		const { getByTestId, queryByTestId } = render(
			<DownloadListItem
				item={model}
				index={0}
				onSelect={onSelect}
				onDelete={jest.fn()}
				onOpen={jest.fn()}
				onPlay={jest.fn()}
				isEditMode={true}
			/>
		);

		expect(queryByTestId('select-checkbox')).not.toBeNull();

		expect(getByTestId('title')).toHaveTextContent('title');
		expect(getByTestId('subtitle')).toHaveTextContent('file name.mp4');

		expect(queryByTestId('loading-indicator')).toBeNull();
		expect(queryByTestId('failed-icon')).toBeNull();

		expect(onSelect).not.toHaveBeenCalled();

		// Pressing the list item and checkbox should call select
		fireEvent.press(getByTestId('list-item'));
		expect(onSelect).toHaveBeenCalledTimes(1);
		fireEvent.press(getByTestId('select-checkbox'));
		expect(onSelect).toHaveBeenCalledTimes(2);
	});

	it('should display a warning for failed downloads', () => {
		model.status = DownloadStatus.Failed;

		const { getByTestId, queryByTestId } = render(
			<DownloadListItem
				item={model}
				index={0}
				onSelect={jest.fn()}
				onOpen={jest.fn()}
				onPlay={jest.fn()}
				onDelete={jest.fn()}
			/>
		);

		expect(queryByTestId('select-checkbox')).toBeNull();
		expect(queryByTestId('loading-indicator')).toBeNull();

		expect(getByTestId('title')).toHaveTextContent('title');
		expect(getByTestId('subtitle')).toHaveTextContent('file name.mp4');

		expect(queryByTestId('failed-icon')).not.toBeNull();
	});
});
