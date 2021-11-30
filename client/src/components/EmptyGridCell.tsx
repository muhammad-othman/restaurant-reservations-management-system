import React, { FC } from 'react'
import { Card, Col, Image, Row } from 'react-bootstrap'
import { ITable } from '../types'
import { useDrag, useDrop } from 'react-dnd'


export interface IEmptyGridCellProps {
  index: number;
  onClick?: (table: ITable) => void;
  onDrop?: (table: ITable) => void;
}

const EmptyGridCell: FC<IEmptyGridCellProps> = ({ index, onClick, onDrop }) => {


  const [, drop] = useDrop(
    () => ({
      accept: 'table',
      drop: onDrop,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [],
  )
  return (
    <div className='col-xs-1-10 p-1 text-center' ref={drop}>
      <Card bg='secondary' text='dark' style={{ height: '100%', minHeight: '117px', cursor: 'pointer' }}>
        <Card.Body className='p-2 pb-0'>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 80 35"
            preserveAspectRatio="xMinYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            style={{ textAlign: 'center' }}
          >
            <text
              x="50%" y="45%" dominantBaseline="middle" textAnchor="middle"
              fontSize="50"
              fill="#fafafa"
            >+</text>
          </svg>

        </Card.Body>
      </Card>
    </div>
  )
}

export default EmptyGridCell
