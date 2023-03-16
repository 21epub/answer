import { FC } from 'react';
import { ListGroup } from 'react-bootstrap';

import styled from '@emotion/styled';

const CListGroup = styled(ListGroup)`
  .list-group-item {
    border: 0px;
  }
  .list-group-item-action:hover {
    .link-dark {
      color: rgb(22, 132, 252) !important;
    }
  }
  .list-group-item-action:focus {
    .link-dark {
      color: rgb(22, 132, 252) !important;
    }
  }
`;

interface IProps {
  children: React.ReactNode;
}

const CustomizeGroup: FC<IProps> = ({ children }) => {
  return <CListGroup>{children}</CListGroup>;
};

export default CustomizeGroup;
