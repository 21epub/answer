import { FC } from 'react';
import { Card, ListGroupItem } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Avatar, EpubCustomizeGroup } from '@/components';
import { useQueryContributeUsers } from '@/services';

const EpubActiveUsers: FC = () => {
  const { t } = useTranslation('translation');
  const { data: users } = useQueryContributeUsers();

  return (
    <Card className="mt-4 left-bar">
      <Card.Header>{t('epub360.home.active_users_without_colon')}</Card.Header>
      <EpubCustomizeGroup>
        {users?.users_with_the_most_reputation?.map((user) => (
          <ListGroupItem
            key={user.username}
            as={Link}
            to={`/users/${user.username}`}
            action>
            <div className="link-dark">
              <div className="d-flex">
                <Avatar size="48px" avatar={user?.avatar} searchStr="s=96" />
                <div className="ms-2">
                  {user.display_name}
                  <div className="text-secondary fs-14">
                    {`${user.rank} ${t('reputation')}`}
                  </div>
                </div>
              </div>
            </div>
          </ListGroupItem>
        ))}
      </EpubCustomizeGroup>
    </Card>
  );
};

export default EpubActiveUsers;
