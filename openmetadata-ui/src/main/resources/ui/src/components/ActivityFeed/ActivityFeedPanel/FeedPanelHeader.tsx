/*
 *  Copyright 2022 Collate.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { PlusOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getEntityFieldDisplay,
  getFeedPanelHeaderText,
} from '../../../utils/FeedUtils';
import { FeedPanelHeaderProp } from './ActivityFeedPanel.interface';

const FeedPanelHeader: FC<FeedPanelHeaderProp> = ({
  onCancel,
  entityField,
  className,
  noun,
  onShowNewConversation,
  threadType,
  entityFQN = '',
  hideCloseIcon = false,
}) => {
  const { t } = useTranslation();

  return (
    <header className={className}>
      <div className="d-flex justify-between p-y-md">
        <p data-testid="header-title">
          <span data-testid="header-noun">
            {noun ? noun : getFeedPanelHeaderText(threadType)}{' '}
            {t('label.on-lowercase')}{' '}
          </span>
          <span data-testid="entity-attribute">
            {entityField ? getEntityFieldDisplay(entityField) : entityFQN}
          </span>
        </p>
        <div className="d-flex">
          {onShowNewConversation ? (
            <Tooltip
              placement="bottom"
              title={t('label.start-entity', {
                entity: t('label.conversation-lowercase'),
              })}
              trigger="hover">
              <Button
                data-testid="add-new-conversation"
                icon={<PlusOutlined />}
                size="small"
                type="primary"
                onClick={() => {
                  onShowNewConversation?.(true);
                }}
              />
            </Tooltip>
          ) : null}
          {hideCloseIcon ? null : (
            <svg
              className="cursor-pointer self-center"
              data-testid="closeDrawer"
              fill="none"
              stroke="#6B7280"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              onClick={onCancel}>
              <path
                d="M6 18L18 6M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          )}
        </div>
      </div>
    </header>
  );
};

export default FeedPanelHeader;
