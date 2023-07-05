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

import { Col, Modal, Row, Typography } from 'antd';
import classNames from 'classnames';
import { CookieStorage } from 'cookie-storage';
import { t } from 'i18next';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { DE_ACTIVE_COLOR, PRIMERY_COLOR } from '../../../constants/constants';
import CloseIcon from '../CloseIcon.component';
import { VersionIndicatorIcon } from '../VersionIndicatorIcon.component';
import ChangeLogs from './ChangeLogs';
import FeaturesCarousel from './FeaturesCarousel';
import { COOKIE_VERSION, LATEST_VERSION_ID, WHATS_NEW } from './whatsNewData';
import { ToggleType, WhatsNewModalProps } from './WhatsNewModal.interface';
import './WhatsNewModal.styles.less';
import { getReleaseVersionExpiry } from './WhatsNewModal.util';

const cookieStorage = new CookieStorage();

export const WhatsNewModal: FunctionComponent<WhatsNewModalProps> = ({
  header,
  onCancel,
  visible,
}: WhatsNewModalProps) => {
  const [activeData, setActiveData] = useState(WHATS_NEW[LATEST_VERSION_ID]);
  const [checkedValue, setCheckedValue] = useState<ToggleType>('features');

  // Let's replace it with AntD ButtonGroup instead using custom classes and styles
  const getToggleButtonClasses = (type: string): string => {
    return (
      'flex-1 font-medium' +
      (type === checkedValue ? 'bg-primary text-white' : 'text-primary ')
    );
  };

  const handleToggleChange = (type: ToggleType) => {
    setCheckedValue(type);
  };

  const handleCancel = () => {
    cookieStorage.setItem(COOKIE_VERSION, 'true', {
      expires: getReleaseVersionExpiry(),
    });
    onCancel();
  };

  useEffect(() => {
    const hasFeatures = activeData.features.length > 0;
    if (hasFeatures) {
      setCheckedValue('features');
    } else {
      setCheckedValue('change-log');
    }
  }, [activeData]);

  return (
    <Modal
      centered
      destroyOnClose
      className="whats-new-modal"
      closeIcon={
        <CloseIcon dataTestId="closeWhatsNew" handleCancel={handleCancel} />
      }
      data-testid="whats-new-dialog"
      footer={null}
      maskClosable={false}
      open={visible}
      title={
        <Typography.Text strong data-testid="whats-new-header">
          {header}
        </Typography.Text>
      }
      width={1200}>
      <Row className="w-auto h-full h-min-75">
        <Col className="border-r-2 p-x-md p-y-md border-separate" span={3}>
          <div className="d-flex flex-col-reverse">
            {WHATS_NEW.map((d) => (
              <div className="flex items-center justify-end mb-2.5" key={d.id}>
                <VersionIndicatorIcon
                  fill={
                    activeData.id === d.id ? PRIMERY_COLOR : DE_ACTIVE_COLOR
                  }
                />
                <button
                  className={classNames(
                    'm-l-xss',
                    activeData.id === d.id ? 'text-primary' : null
                  )}
                  onClick={() => setActiveData(d)}>
                  {d.version}
                </button>
              </div>
            ))}
          </div>
        </Col>
        <Col className="overflow-y-auto" span={21}>
          <div className="p-t-md px-10 ">
            <div className="flex justify-between items-center p-b-sm">
              <div>
                <p className="text-base font-medium">{activeData.version}</p>
                <p className="text-grey-muted text-xs">
                  {activeData.description}
                </p>
              </div>
              <div>
                {activeData.features.length > 0 && (
                  <div
                    className={classNames('whats-new-modal-button-container', {
                      'w-60': activeData.features.length > 0,
                    })}>
                    <button
                      className={getToggleButtonClasses('features')}
                      data-testid="WhatsNewModalFeatures"
                      onClick={() => handleToggleChange('features')}>
                      {t('label.feature-plural')}
                    </button>

                    <button
                      className={getToggleButtonClasses('change-log')}
                      data-testid="WhatsNewModalChangeLogs"
                      onClick={() => {
                        handleToggleChange('change-log');
                      }}>
                      {t('label.change-entity', {
                        entity: t('label.log-plural'),
                      })}
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div>
              {checkedValue === 'features' &&
                activeData.features.length > 0 && (
                  <FeaturesCarousel data={activeData.features} />
                )}
              {checkedValue === 'change-log' && (
                <ChangeLogs
                  data={
                    activeData.changeLogs as unknown as {
                      [name: string]: string;
                    }
                  }
                />
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Modal>
  );
};
