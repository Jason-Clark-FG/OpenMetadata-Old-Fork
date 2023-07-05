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

/* eslint-disable max-len */

import React from 'react';
import RichTextEditorPreviewer from '../../common/rich-text-editor/RichTextEditorPreviewer';

type Props = {
  data: { [name: string]: string };
};

const ChangeLogs = ({ data }: Props) => {
  const logKeys: Array<string> = Object.keys(data);

  return (
    <div>
      {logKeys.map((log, index) => (
        <div key={index}>
          <div>
            <p className="text-base font-medium">{log}</p>
          </div>
          <RichTextEditorPreviewer
            enableSeeMoreVariant={false}
            markdown={data[log]}
          />
        </div>
      ))}
    </div>
  );
};

export default ChangeLogs;
