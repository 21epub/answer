import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import dayjs from 'dayjs';
// import classNames from 'classnames';
import { generateHtmlFromState, TextEditor } from '@21epub-ui/text-editor';

import { handleFormError } from '@/utils';
import { usePageTags, usePromptWithUnload } from '@/hooks';
import { pathFactory } from '@/router/pathFactory';
import { Icon } from '@/components';
import type * as Type from '@/common/interface';
import {
  useQueryAnswerInfo,
  modifyAnswer,
  useQueryRevisions,
} from '@/services';
import './index.scss';
import MaterialModal, {
  ModalStateType,
} from '../Detail/components/WriteAnswer/MaterialModal';

interface FormDataItem {
  content: Type.FormValue<string>;
  description: Type.FormValue<string>;
}
const initFormData = {
  content: {
    value: '',
    isInvalid: false,
    errorMsg: '',
    content_json: null,
  },
  description: {
    value: '',
    isInvalid: false,
    errorMsg: '',
  },
};
const Index = () => {
  const { aid = '', qid = '' } = useParams();
  // const [focusType, setForceType] = useState('');

  const { t } = useTranslation('translation', { keyPrefix: 'edit_answer' });
  const navigate = useNavigate();

  const { data } = useQueryAnswerInfo(aid);
  const [formData, setFormData] = useState<FormDataItem>(initFormData);
  const [immData] = useState(initFormData);
  const [contentChanged, setContentChanged] = useState(false);
  const [modalState, setModalState] = useState<ModalStateType>({ open: false });

  initFormData.content.value = data?.info.content || '';

  const { data: revisions = [] } = useQueryRevisions(aid);

  const questionContentRef = useRef<HTMLDivElement>(null);

  usePromptWithUnload({
    when: contentChanged,
  });

  useEffect(() => {
    const { content, description } = formData;
    if (immData.content.value !== content.value || description.value) {
      setContentChanged(true);
    } else {
      setContentChanged(false);
    }
  }, [formData.content.value, formData.description.value]);

  // const handleAnswerChange = (value: string) =>
  //   setFormData({
  //     ...formData,
  //     content: { ...formData.content, value },
  //   });
  const handleSummaryChange = (evt) => {
    const v = evt.currentTarget.value;
    setFormData({
      ...formData,
      description: { ...formData.description, value: v },
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setContentChanged(false);

    event.preventDefault();
    event.stopPropagation();

    const params: Type.AnswerParams = {
      content: formData.content.value,
      html: formData.content.value,
      question_id: qid,
      id: aid,
      edit_summary: formData.description.value,
      content_json: formData.content.content_json,
    };
    modifyAnswer(params)
      .then((res) => {
        navigate(
          pathFactory.answerLanding({
            questionId: qid,
            slugTitle: data?.question?.url_title,
            answerId: aid,
          }),
          {
            state: { isReview: res?.wait_for_review },
          },
        );
      })
      .catch((ex) => {
        if (ex.isError) {
          const stateData = handleFormError(ex, formData);
          setFormData({ ...stateData });
        }
      });
  };
  const handleSelectedRevision = (e) => {
    const index = e.target.value;
    const revision = revisions[index];
    formData.content.value = revision.content.content;
    // setImmData({ ...formData });
    setFormData({ ...formData });
  };

  const backPage = () => {
    navigate(-1);
  };
  usePageTags({
    title: t('edit_answer', { keyPrefix: 'page_title' }),
  });

  return (
    <Container className="pt-4 mt-2 mb-5 edit-answer-wrap">
      <Row className="justify-content-center">
        <Col xxl={10} md={12}>
          <h3 className="mb-4">{t('title')}</h3>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xxl={7} lg={8} sm={12} className="mb-4 mb-md-0">
          <a
            href={pathFactory.questionLanding(qid, data?.question.url_title)}
            target="_blank"
            rel="noreferrer">
            <h5 className="mb-3">{data?.question.title}</h5>
          </a>

          <div className="question-content-wrap">
            <div
              ref={questionContentRef}
              className="content position-absolute top-0 w-100"
              dangerouslySetInnerHTML={{ __html: data?.question.html }}
            />
            <div
              className="resize-bottom"
              style={{ maxHeight: questionContentRef?.current?.scrollHeight }}
            />
            <div className="line bg-light  d-flex justify-content-center align-items-center">
              <Icon name="three-dots" />
            </div>
          </div>

          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group controlId="revision" className="mb-3">
              <Form.Label>{t('form.fields.revision.label')}</Form.Label>
              <Form.Select onChange={handleSelectedRevision}>
                {revisions.map(({ create_at, reason, user_info }, index) => {
                  const date = dayjs(create_at * 1000)
                    .tz()
                    .format(t('long_date_with_time', { keyPrefix: 'dates' }));
                  return (
                    <option key={`${create_at}`} value={index}>
                      {`${date} - ${user_info.display_name} - ${
                        reason || t('default_reason')
                      }`}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="answer" className="mt-3">
              <Form.Label>{t('form.fields.answer.label')}</Form.Label>
              {data?.info && (
                <TextEditor
                  initialState={data?.info?.content_json}
                  onInsert={(type, callback_) => {
                    if (type === 'image') {
                      setModalState({
                        open: true,
                        onInsert: (link) => {
                          callback_({ src: link.value, title: '' });
                        },
                      });
                    }
                  }}
                  style={{
                    height: '400px',
                    border: '1px #d9d9d9 solid',
                  }}
                  onChange={(editorState, editor) => {
                    editor.update(async () => {
                      const state = editorState.toJSON();
                      const content = await generateHtmlFromState(state);
                      setFormData({
                        ...formData,
                        content: {
                          value: content,
                          isInvalid: false,
                          errorMsg: '',
                          content_json: state,
                        },
                      });
                    });
                  }}
                />
              )}
              <Form.Control.Feedback type="invalid">
                {formData.content.errorMsg}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="edit_summary" className="my-3">
              <Form.Label>{t('form.fields.edit_summary.label')}</Form.Label>
              <Form.Control
                type="text"
                onChange={handleSummaryChange}
                defaultValue={formData.description.value}
                isInvalid={formData.description.isInvalid}
                placeholder={t('form.fields.edit_summary.placeholder')}
              />
              <Form.Control.Feedback type="invalid">
                {formData.description.errorMsg}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="mt-3">
              <Button type="submit" className="me-2">
                {t('btn_save_edits')}
              </Button>
              <Button variant="link" onClick={backPage}>
                {t('btn_cancel')}
              </Button>
            </div>
            {modalState.open && (
              <MaterialModal
                visible={modalState.open}
                setModalState={setModalState}
                onInsert={modalState?.onInsert}
              />
            )}
          </Form>
        </Col>
        <Col xxl={3} lg={4} sm={12} className="mt-5 mt-lg-0" />
      </Row>
    </Container>
  );
};

export default Index;
