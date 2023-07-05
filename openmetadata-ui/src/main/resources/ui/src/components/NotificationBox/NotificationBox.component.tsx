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

import { Badge, Button, List, Tabs, Typography } from 'antd';
import { AxiosError } from 'axios';
import { ActivityFeedTabs } from 'components/ActivityFeed/ActivityFeedTab/ActivityFeedTab.interface';
import { EntityTabs } from 'enums/entity.enum';
import { UserProfileTab } from 'enums/user.enum';
import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getFeedsWithFilter } from 'rest/feedsAPI';
import AppState from '../../AppState';
import {
  getUserPath,
  NOTIFICATION_READ_TIMER,
} from '../../constants/constants';
import { FeedFilter } from '../../enums/mydata.enum';
import { NotificationTabsKey } from '../../enums/notification.enum';
import { ThreadType } from '../../generated/api/feed/createThread';
import { Post, Thread } from '../../generated/entity/feed/thread';
import { getEntityFQN, getEntityType } from '../../utils/FeedUtils';
import SVGIcons, { Icons } from '../../utils/SvgUtils';
import { showErrorToast } from '../../utils/ToastUtils';
import Loader from '../Loader/Loader';
import './notification-box.less';
import { NotificationBoxProp } from './NotificationBox.interface';
import { getFilters, tabsInfo } from './NotificationBox.utils';
import NotificationFeedCard from './NotificationFeedCard.component';

const NotificationBox = ({
  hasMentionNotification,
  hasTaskNotification,
  onMarkTaskNotificationRead,
  onMarkMentionsNotificationRead,
  onTabChange,
}: NotificationBoxProp) => {
  const { t } = useTranslation();
  const currentUser = useMemo(
    () => AppState.getCurrentUserDetails(),
    [AppState.userDetails, AppState.nonSecureUserDetails]
  );
  const [notifications, setNotifications] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [viewAllPath, setViewAllPath] = useState<string>(
    getUserPath(
      currentUser?.name as string,
      EntityTabs.ACTIVITY_FEED,
      ActivityFeedTabs.TASKS
    )
  );

  const notificationDropDownList = useMemo(() => {
    return notifications.slice(0, 5).map((feed, idx) => {
      const mainFeed = {
        message: feed.message,
        postTs: feed.threadTs,
        from: feed.createdBy,
        id: feed.id,
        reactions: feed.reactions,
      } as Post;
      const entityType = getEntityType(feed.about);
      const entityFQN = getEntityFQN(feed.about);

      return (
        <NotificationFeedCard
          createdBy={mainFeed.from}
          entityFQN={entityFQN as string}
          entityType={entityType as string}
          feedType={feed.type || ThreadType.Conversation}
          key={`${mainFeed.from} ${idx}`}
          task={feed}
          timestamp={mainFeed.postTs}
        />
      );
    });
  }, [notifications]);

  const getNotificationData = (
    threadType: ThreadType,
    feedFilter: FeedFilter
  ) => {
    setIsLoading(true);
    getFeedsWithFilter(currentUser?.id, feedFilter, undefined, threadType)
      .then((res) => {
        setNotifications(res.data);
      })
      .catch((err: AxiosError) => {
        showErrorToast(
          err,
          t('server.entity-fetch-error', {
            entity: t('label.notification'),
          })
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const updateActiveTab = useCallback(
    (key: string) => {
      onTabChange(key);
      const { threadType, feedFilter } = getFilters(key as ThreadType);

      getNotificationData(threadType, feedFilter);

      setViewAllPath(
        `${getUserPath(currentUser?.name as string)}/${(threadType ===
        ThreadType.Conversation
          ? UserProfileTab.ACTIVITY
          : threadType
        ).toLowerCase()}?feedFilter=${feedFilter}`
      );

      if (hasTaskNotification || hasMentionNotification) {
        setTimeout(() => {
          key === NotificationTabsKey.TASK
            ? onMarkTaskNotificationRead()
            : onMarkMentionsNotificationRead();
        }, NOTIFICATION_READ_TIMER);
      }
    },
    [currentUser, hasTaskNotification, hasMentionNotification]
  );

  useEffect(() => {
    getNotificationData(ThreadType.Task, FeedFilter.ASSIGNED_TO);
  }, []);

  const getTabTitle = (name: string, key: string) => {
    return (
      <Badge
        dot={
          key === NotificationTabsKey.TASK
            ? hasTaskNotification
            : hasMentionNotification
        }
        offset={[5, 0]}>
        <SVGIcons
          alt="notification-icon"
          className="m-r-xs"
          icon={key === NotificationTabsKey.TASK ? Icons.TASK : Icons.MENTIONS}
          width="14px"
        />
        {name}
      </Badge>
    );
  };

  const notificationList = useMemo(
    () =>
      isEmpty(notifications) ? (
        <div className="h-64 flex-center">
          <p>{t('message.no-notification-found')}</p>
        </div>
      ) : (
        <List
          dataSource={notificationDropDownList}
          footer={
            <Button block href={viewAllPath} type="link">
              <span>
                {t('label.view-entity', {
                  entity: t('label.all-lowercase'),
                })}
              </span>
            </Button>
          }
          itemLayout="vertical"
          renderItem={(item) => (
            <List.Item className="cursor-pointer">{item}</List.Item>
          )}
          size="small"
        />
      ),
    [notifications]
  );

  return (
    <div className="bg-white d-flex flex-col justify-between notification-box">
      <Typography.Title data-testid="notification-heading" level={5}>
        {t('label.notification-plural')}
      </Typography.Title>
      <Tabs
        defaultActiveKey="Task"
        size="small"
        tabBarGutter={24}
        tabBarStyle={{
          borderBottom: '1px solid #DCE3EC',
          margin: '0px',
          paddingLeft: '16px',
          color: 'inherit',
        }}
        onTabClick={updateActiveTab}>
        {tabsInfo.map(({ name, key }) => (
          <Tabs.TabPane key={key} tab={getTabTitle(name, key)}>
            {isLoading ? (
              <div className="h-64 d-flex items-center justify-center">
                <Loader size="small" />
              </div>
            ) : (
              notificationList
            )}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default NotificationBox;
