import React, { FC, useEffect, useRef } from 'react'
import { Card, Col, Image, Row } from 'react-bootstrap'
import { ITable } from '../types'
import { useDrag, useDrop } from 'react-dnd'

export interface IGrideCellProps {
  index: number;
  table: ITable;
  setCardHeight: (h: number) => void;
  cardHeight: number;
  onClick: (table: ITable) => void;
}

const GridCell: FC<IGrideCellProps> = ({ index, table, onClick, setCardHeight, cardHeight }) => {
  const cardRef = useRef(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'table',
    item: table,
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    const height = cardRef.current.offsetHeight;
    if (height != cardHeight)
      setCardHeight(height);
  })

  return (
    <div
      className='col-xs-1-10 p-1 text-center'
      ref={drag}
    >
      <Card ref={cardRef}
        onClick={() => onClick(table)}
        bg='warning'
        text='dark'
        style={{
          height: '100%',
          minHeight: '110px',
          cursor: 'pointer',
          opacity: isDragging ? 0.5 : 1
        }}>
        <Card.Body className='p-2 pb-0'>
          <Row className="justify-content-center">
            <Col xs="12" className="p-0 mt-1">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 80 20"
                preserveAspectRatio="xMinYMid meet"
                xmlns="http://www.w3.org/2000/svg"
                style={{ textAlign: 'center' }}
              >
                <text
                  x="50%" y="60%" dominantBaseline="middle" textAnchor="middle"
                  fontSize="25"
                  fontWeight="bold"
                  fill="#9c2525"
                >#{index}</text>
              </svg>
            </Col>
          </Row>

          <Row className="justify-content-center p-1">
            <Col xs="12" md="6" className="p-0 mt-1">
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
                  fontSize="30"
                  fill="#9c2525"
                >{table.seats} x</text>
              </svg>
            </Col>
            <Col xs="12" md="6" className="p-1 mt-1">
              <Image src="/chair.svg" fluid style={{ maxHeight: '50px' }} />
            </Col>
          </Row>

        </Card.Body>
      </Card>
    </div>
  )

}

export default GridCell
