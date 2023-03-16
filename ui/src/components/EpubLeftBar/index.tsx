import { FC, useMemo } from 'react';
import { Card, ListGroupItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import styled from '@emotion/styled';

import { EpubCustomizeGroup, Icon } from '@/components';
import { useQueryTags } from '@/services';
import { loggedUserInfoStore } from '@/stores';

const MoreButton = styled.a`
  font-size: 14px;
  cursor: pointer;
  :hover {
    color: rgb(22, 132, 252) !important;
  }
`;

const EpubLeftBar: FC = () => {
  const { t } = useTranslation('translation');
  const { user: loggedUser } = loggedUserInfoStore((_) => _);

  const { data: tags } = useQueryTags({
    page: 1,
    page_size: 5,
  });

  const allEle = useMemo(
    () => [{ tag_id: 'all_tag', slug_name: '', display_name: '全部' }],
    [],
  );

  return (
    <Card className="mb-4 left-bar">
      <Card.Header>{t('epub360.tags.popular_tags')}</Card.Header>
      <Card.Body>
        <EpubCustomizeGroup>
          {tags?.list &&
            allEle?.concat(tags?.list).map((tag) => (
              <ListGroupItem
                key={tag.tag_id}
                as={Link}
                to={`/questions?tag=${tag.slug_name}`}
                action>
                <div className="link-dark">
                  <span style={{ fontWeight: 600, fontSize: '16px' }}>#</span>
                  <span style={{ marginLeft: '10px' }}>
                    {tag?.display_name}
                  </span>
                </div>
              </ListGroupItem>
            ))}
          <ListGroupItem key="more">
            <MoreButton className="link-dark" href="/tags">
              {t('epub360.tags.home_more')}
            </MoreButton>
          </ListGroupItem>
        </EpubCustomizeGroup>
        {loggedUser.access_token && <hr />}
        {loggedUser.access_token && (
          <EpubCustomizeGroup>
            <ListGroupItem
              key="my_answers"
              as={Link}
              to={`/users/${loggedUser.username}/answers`}
              action>
              <div className="link-dark">
                <Icon name="chat-right-text-fill" />
                <span style={{ marginLeft: '10px' }}>
                  {t('epub360.personal.my_answers')}
                </span>
                <span>（{loggedUser.answer_count}）</span>
              </div>
            </ListGroupItem>
            <ListGroupItem
              key="my_questions"
              as={Link}
              to={`/users/${loggedUser.username}/questions`}
              action>
              <div className="link-dark">
                <Icon name="question-diamond-fill" />
                <span style={{ marginLeft: '10px' }}>
                  {t('epub360.personal.my_questions')}
                </span>
                <span>（{loggedUser.question_count}）</span>
              </div>
            </ListGroupItem>
            <ListGroupItem
              key="my_achievement"
              as={Link}
              to={`/users/${loggedUser.username}/reputation`}
              action>
              <div className="link-dark">
                <Icon name="trophy-fill" />
                <span style={{ marginLeft: '10px' }}>
                  {t('epub360.personal.my_reputation')}
                </span>
                <span>（{loggedUser.rank}）</span>
              </div>
            </ListGroupItem>
          </EpubCustomizeGroup>
        )}
      </Card.Body>
    </Card>
  );
};

export default EpubLeftBar;
