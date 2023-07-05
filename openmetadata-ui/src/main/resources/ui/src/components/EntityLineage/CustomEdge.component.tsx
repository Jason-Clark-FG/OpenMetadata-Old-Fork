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

import { Button } from 'antd';
import React, { Fragment, useCallback } from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';
import { ReactComponent as FunctionIcon } from '../../assets/svg/ic-function.svg';
import { ReactComponent as PipelineIcon } from '../../assets/svg/pipeline-grey.svg';
import { FOREIGN_OBJECT_SIZE } from '../../constants/Lineage.constants';
import { EntityType } from '../../enums/entity.enum';
import SVGIcons from '../../utils/SvgUtils';
import { CustomEdgeData } from './EntityLineage.interface';

interface LineageEdgeIconProps {
  children: React.ReactNode;
  x: number;
  y: number;
  offset: number;
}

export const LineageEdgeIcon = ({
  children,
  x,
  y,
  offset,
}: LineageEdgeIconProps) => {
  return (
    <foreignObject
      height={FOREIGN_OBJECT_SIZE}
      requiredExtensions="http://www.w3.org/1999/xhtml"
      width={FOREIGN_OBJECT_SIZE}
      x={x - FOREIGN_OBJECT_SIZE / offset}
      y={y - FOREIGN_OBJECT_SIZE / offset}>
      {children}
    </foreignObject>
  );
};

export const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  selected,
}: EdgeProps) => {
  const { onEdgeClick, addPipelineClick, ...rest } = data;
  const offset = 4;

  const [edgePath, edgeCenterX, edgeCenterY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const [invisibleEdgePath] = getBezierPath({
    sourceX: sourceX + offset,
    sourceY: sourceY + offset,
    sourcePosition,
    targetX: targetX + offset,
    targetY: targetY + offset,
    targetPosition,
  });
  const [invisibleEdgePath1] = getBezierPath({
    sourceX: sourceX - offset,
    sourceY: sourceY - offset,
    sourcePosition,
    targetX: targetX - offset,
    targetY: targetY - offset,
    targetPosition,
  });

  const isPipelineEdgeAllowed = (
    sourceType: EntityType,
    targetType: EntityType
  ) => {
    return (
      [EntityType.TABLE, EntityType.TOPIC].indexOf(sourceType) > -1 &&
      [EntityType.TABLE, EntityType.TOPIC].indexOf(targetType) > -1
    );
  };

  const isColumnLineageAllowed =
    !data.isColumnLineage &&
    isPipelineEdgeAllowed(data.sourceType, data.targetType);
  const hasLabel = data.label;
  const isSelectedEditMode = selected && data.isEditMode;
  const isSelected = selected;

  const getInvisiblePath = (path: string) => {
    return (
      <path
        className="react-flow__edge-path"
        d={path}
        data-testid="react-flow-edge-path"
        id={id}
        markerEnd={markerEnd}
        style={{ ...style, strokeWidth: '6px', opacity: 0 }}
      />
    );
  };

  const getLineageEdgeIcon = useCallback(
    (icon: React.ReactNode, dataTestId: string) => {
      return (
        <LineageEdgeIcon offset={3} x={edgeCenterX} y={edgeCenterY}>
          <Button
            className="d-flex justify-center items-center custom-edge-pipeline-button"
            data-testid={dataTestId}
            icon={icon}
            type="primary"
            onClick={(event) =>
              data.isEditMode &&
              data.addPipelineClick?.(event, rest as CustomEdgeData)
            }
          />
        </LineageEdgeIcon>
      );
    },
    [edgeCenterX, edgeCenterY, rest, data]
  );

  const getEditLineageIcon = useCallback(
    (
      dataTestId: string,
      rotate: boolean,
      onClick:
        | ((
            event: React.MouseEvent<HTMLElement, MouseEvent>,
            data: CustomEdgeData
          ) => void)
        | undefined
    ) => {
      return (
        <LineageEdgeIcon offset={offset} x={edgeCenterX} y={edgeCenterY}>
          <Button
            className="cursor-pointer d-flex"
            data-testid={dataTestId}
            icon={
              <SVGIcons
                alt="times-circle"
                icon="icon-times-circle"
                width="16px"
              />
            }
            style={{
              transform: rotate ? 'rotate(45deg)' : 'none',
            }}
            type="link"
            onClick={(event) => onClick?.(event, rest as CustomEdgeData)}
          />
        </LineageEdgeIcon>
      );
    },
    [offset, edgeCenterX, edgeCenterY, rest, data]
  );

  return (
    <Fragment>
      <path
        className="react-flow__edge-path"
        d={edgePath}
        data-testid="react-flow-edge-path"
        id={id}
        markerEnd={markerEnd}
        style={style}
      />
      {getInvisiblePath(invisibleEdgePath)}
      {getInvisiblePath(invisibleEdgePath1)}

      {isColumnLineageAllowed &&
        hasLabel &&
        getLineageEdgeIcon(<PipelineIcon />, 'pipeline-label')}
      {isColumnLineageAllowed &&
        isSelectedEditMode &&
        getEditLineageIcon('add-pipeline', true, addPipelineClick)}
      {!isColumnLineageAllowed &&
        isSelectedEditMode &&
        isSelected &&
        getEditLineageIcon('delete-button', false, onEdgeClick)}
      {!isColumnLineageAllowed &&
        data.columnFunctionValue &&
        data.isExpanded &&
        getLineageEdgeIcon(<FunctionIcon />, 'function-icon')}
    </Fragment>
  );
};
