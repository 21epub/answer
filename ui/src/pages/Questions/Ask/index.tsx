import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import {
  generateHtmlFromState,
  LexicalEditor,
  SerializedEditorState,
  TextEditor,
} from '@21epub-ui/text-editor';
// import classNames from 'classnames';
import dayjs from 'dayjs';

import type * as Type from '@/common/interface';
import { TagSelector } from '@/components';
import { usePageTags } from '@/hooks';
import { pathFactory } from '@/router/pathFactory';
import {
  getTagsBySlugName,
  modifyQuestion,
  postAnswer,
  questionDetail,
  saveQuestion,
  useQueryQuestionByTitle,
  useQueryRevisions,
} from '@/services';
import { handleFormError } from '@/utils';
import MaterialModal, {
  ModalStateType,
} from '../Detail/components/WriteAnswer/MaterialModal';

import SearchQuestion from './components/SearchQuestion';

interface FormDataItem {
  title: Type.FormValue<string>;
  tags: Type.FormValue<Type.Tag[]>;
  content: Type.FormValue<SerializedEditorState | undefined>;
  edit_summary: Type.FormValue<string>;
}

const Ask = () => {
  const initFormData = {
    title: {
      value: '',
      isInvalid: false,
      errorMsg: '',
    },
    tags: {
      value: [],
      isInvalid: false,
      errorMsg: '',
    },
    content: {
      value: undefined,
      isInvalid: false,
      errorMsg: '',
    },
    edit_summary: {
      value: '',
      isInvalid: false,
      errorMsg: '',
    },
  };
  const { t } = useTranslation('translation', { keyPrefix: 'ask' });
  const [formData, setFormData] = useState<FormDataItem>(initFormData);
  const [, setImmData] = useState<FormDataItem>(initFormData);
  const [checked, setCheckState] = useState(false);
  const [, setContentChanged] = useState(false);
  const [modalState, setModalState] = useState<ModalStateType>({ open: false });
  const [, setForceType] = useState('');

  const editorRef = useRef<LexicalEditor>();

  const resetForm = () => {
    setFormData(initFormData);
    setCheckState(false);
    setForceType('');
  };

  const { qid } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initQueryTags = () => {
    const queryTags = searchParams.get('tags');
    if (!queryTags) {
      return;
    }
    getTagsBySlugName(queryTags).then((tags) => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      handleTagsChange(tags);
    });
  };

  const isEdit = qid !== undefined;
  const { data: similarQuestions = { list: [] } } = useQueryQuestionByTitle(
    isEdit ? '' : formData.title.value,
  );

  // useEffect(() => {
  //   const { title, tags, content } = formData;
  //   const { title: editTitle, tags: editTags, content: editContent } = immData;

  //   // edited
  //   if (qid) {
  //     if (
  //       editTitle.value !== title.value ||
  //       editContent.value !== content.value ||
  //       !isEqual(
  //         editTags.value.map((v) => v.slug_name),
  //         tags.value.map((v) => v.slug_name),
  //       )
  //     ) {
  //       setContentChanged(true);
  //     } else {
  //       setContentChanged(false);
  //     }
  //     return;
  //   }

  //   // write
  //   if (title.value || tags.value.length > 0 || content.value || answer.value) {
  //     setContentChanged(true);
  //   } else {
  //     setContentChanged(false);
  //   }
  // }, [formData]);

  // usePromptWithUnload({
  //   when: contentChanged,
  // });

  useEffect(() => {
    if (!isEdit) {
      resetForm();
      initQueryTags();
    }
  }, [isEdit]);
  const { data: revisions = [] } = useQueryRevisions(qid);

  const updateEditorState = (state: SerializedEditorState) => {
    const editor = editorRef.current;

    if (editor === undefined) return;

    editor.update(() => {
      editor.setEditorState(editor.parseEditorState(state));
    });
  };

  useEffect(() => {
    if (!isEdit) {
      return;
    }
    questionDetail(qid).then((res) => {
      console.log('res 编辑问题', res);
      formData.title.value = res.title;
      formData.content.value = res.content_json;
      formData.tags.value = res.tags.map((item) => {
        return {
          ...item,
          parsed_text: '',
          original_text: '',
        };
      });
      setImmData({ ...formData });
      setFormData({ ...formData });
      updateEditorState(res.content_json);
    });
  }, [qid]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      title: { ...formData.title, value: e.currentTarget.value, errorMsg: '' },
    });
  };
  // const handleContentChange = (value: SerializedEditorState) => {
  //   setFormData({
  //     ...formData,
  //     content: { ...formData.content, value, errorMsg: '' },
  //   });
  // };
  const handleTagsChange = (value) =>
    setFormData({
      ...formData,
      tags: { ...formData.tags, value, errorMsg: '' },
    });

  // const handleAnswerChange = (value: string) =>
  //   setFormData({
  //     ...formData,
  //     answer: { ...formData.answer, value, errorMsg: '' },
  //   });

  const handleSummaryChange = (evt: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({
      ...formData,
      edit_summary: {
        ...formData.edit_summary,
        value: evt.currentTarget.value,
      },
    });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setContentChanged(false);
    event.preventDefault();
    event.stopPropagation();

    const params: Type.QuestionParams = {
      title: formData.title.value,
      html: formData.content.value
        ? await generateHtmlFromState(formData.content.value)
        : '',
      content: editorRef.current?.getRootElement()?.innerText ?? '',
      content_json: formData.content.value ?? null,
      tags: formData.tags.value,
    };
    if (isEdit) {
      modifyQuestion({
        ...params,
        id: qid,
        edit_summary: formData.edit_summary.value,
      })
        .then((res) => {
          navigate(pathFactory.questionLanding(qid, params.url_title), {
            state: { isReview: res?.wait_for_review },
          });
        })
        .catch((err) => {
          if (err.isError) {
            const data = handleFormError(err, formData);
            setFormData({ ...data });
          }
        });
    } else {
      const res = await saveQuestion(params).catch((err) => {
        if (err.isError) {
          const data = handleFormError(err, formData);
          setFormData({ ...data });
        }
      });

      const id = res?.id;
      if (id) {
        if (checked) {
          postAnswer({
            question_id: id,
            html: formData.content.value
              ? await generateHtmlFromState(formData.content.value)
              : '',
            content: editorRef.current?.getRootElement()?.innerText ?? '',
            content_json: formData.content.value ?? null,
          })
            .then(() => {
              navigate(pathFactory.questionLanding(id, params.url_title));
            })
            .catch((err) => {
              if (err.isError) {
                const data = handleFormError(err, formData, [
                  { from: 'content', to: 'answer' },
                ]);
                setFormData({ ...data });
              }
            });
        } else {
          navigate(pathFactory.questionLanding(id));
        }
      }
    }
  };
  const backPage = () => {
    navigate(-1);
  };

  const handleSelectedRevision = (e) => {
    const index = e.target.value;
    const revision = revisions[index];
    formData.content.value = revision.content.content_json;
    setImmData({ ...formData });
    setFormData({ ...formData });
    updateEditorState(revision.content.content_json);
  };
  const bool = similarQuestions.length > 0 && !isEdit;
  let pageTitle = t('ask_a_question', { keyPrefix: 'page_title' });
  if (isEdit) {
    pageTitle = t('edit_question', { keyPrefix: 'page_title' });
  }
  usePageTags({
    title: pageTitle,
  });
  return (
    <>
      <Container className="pt-4 mt-2 mb-5">
        <Row className="justify-content-center">
          <Col xxl={10} md={12}>
            <h3 className="mb-4">{isEdit ? t('edit_title') : t('title')}</h3>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xxl={7} lg={8} sm={12} className="mb-4 mb-md-0">
            <Form noValidate onSubmit={handleSubmit}>
              {isEdit && (
                <Form.Group controlId="revision" className="mb-3">
                  <Form.Label>{t('form.fields.revision.label')}</Form.Label>
                  <Form.Select onChange={handleSelectedRevision}>
                    {revisions.map(
                      ({ reason, create_at, user_info }, index) => {
                        const date = dayjs(create_at * 1000)
                          .tz()
                          .format(
                            t('long_date_with_time', { keyPrefix: 'dates' }),
                          );
                        return (
                          <option key={`${create_at}`} value={index}>
                            {`${date} - ${user_info.display_name} - ${
                              reason || t('default_reason')
                            }`}
                          </option>
                        );
                      },
                    )}
                  </Form.Select>
                </Form.Group>
              )}

              <Form.Group controlId="title" className="mb-3">
                <Form.Label>{t('form.fields.title.label')}</Form.Label>
                <Form.Control
                  value={formData.title.value}
                  isInvalid={formData.title.isInvalid}
                  onChange={handleTitleChange}
                  placeholder={t('form.fields.title.placeholder')}
                  autoFocus
                />

                <Form.Control.Feedback type="invalid">
                  {formData.title.errorMsg}
                </Form.Control.Feedback>
                {bool && <SearchQuestion similarQuestions={similarQuestions} />}
              </Form.Group>
              <Form.Group controlId="body">
                <Form.Label>{t('form.fields.body.label')}</Form.Label>
                {/* <Form.Control
                defaultValue={formData.content.value}
                isInvalid={formData.content.isInvalid}
                hidden
              /> */}
                <TextEditor
                  initialState={(editor) => {
                    editorRef.current = editor;
                  }}
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

                      setFormData((pre) => {
                        return {
                          ...pre,
                          content: {
                            ...pre.content,
                            value: state,
                          },
                        };
                      });
                    });
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  {formData.content.errorMsg}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="tags" className="my-3">
                <Form.Label>{t('form.fields.tags.label')}</Form.Label>
                <Form.Control
                  defaultValue={JSON.stringify(formData.tags.value)}
                  isInvalid={formData.tags.isInvalid}
                  hidden
                />
                <TagSelector
                  value={formData.tags.value}
                  onChange={handleTagsChange}
                  showRequiredTagText
                />
                <Form.Control.Feedback type="invalid">
                  {formData.tags.errorMsg}
                </Form.Control.Feedback>
              </Form.Group>
              {isEdit && (
                <Form.Group controlId="edit_summary" className="my-3">
                  <Form.Label>{t('form.fields.edit_summary.label')}</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={formData.edit_summary.value}
                    isInvalid={formData.edit_summary.isInvalid}
                    placeholder={t('form.fields.edit_summary.placeholder')}
                    onChange={handleSummaryChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formData.edit_summary.errorMsg}
                  </Form.Control.Feedback>
                </Form.Group>
              )}
              {!checked && (
                <div className="mt-3">
                  <Button type="submit" className="me-2">
                    {isEdit ? t('btn_save_edits') : t('btn_post_question')}
                  </Button>

                  <Button variant="link" onClick={backPage}>
                    {t('cancel', { keyPrefix: 'btns' })}
                  </Button>
                </div>
              )}
              {checked && (
                <Button type="submit" className="mt-3">
                  {t('post_question&answer')}
                </Button>
              )}
            </Form>
          </Col>
          <Col xxl={3} lg={4} sm={12} className="mt-5 mt-lg-0" />
        </Row>
      </Container>
      {modalState.open && (
        <MaterialModal
          visible={modalState.open}
          setModalState={setModalState}
          onInsert={modalState?.onInsert}
        />
      )}
    </>
  );
};

export default Ask;
