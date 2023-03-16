import { memo, useState, FC } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { marked } from 'marked';
import { generateHtmlFromState, TextEditor } from '@21epub-ui/text-editor';

import { usePromptWithUnload } from '@/hooks';
import { Modal, TextArea } from '@/components';
import { FormDataType } from '@/common/interface';
import { postAnswer } from '@/services';
import { guard, handleFormError } from '@/utils';

import MaterialModal, { ModalStateType } from './MaterialModal';

interface Props {
  visible?: boolean;
  data: {
    /** question  id */
    qid: string;
    answered?: boolean;
  };
  callback?: (obj) => void;
}

const Index: FC<Props> = ({ visible = false, data, callback }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'question_detail.write_answer',
  });
  const [formData, setFormData] = useState<FormDataType>({
    content: {
      value: '',
      isInvalid: false,
      errorMsg: '',
    },
  });
  const [showEditor, setShowEditor] = useState<boolean>(visible);
  const [, setFocusType] = useState('');
  const [, setEditorFocusState] = useState(false);
  const [modalState, setModalState] = useState<ModalStateType>({ open: false });

  usePromptWithUnload({
    when: Boolean(formData.content.value),
  });

  const checkValidated = (): boolean => {
    let bol = true;
    const { content } = formData;

    if (!content.value || Array.from(content.value.trim()).length < 6) {
      bol = false;
      formData.content = {
        value: content.value,
        isInvalid: true,
        errorMsg: t('characters'),
      };
    } else {
      formData.content = {
        value: content.value,
        isInvalid: false,
        errorMsg: '',
      };
    }

    setFormData({
      ...formData,
    });
    return bol;
  };

  const handleSubmit = () => {
    if (!guard.tryNormalLogged(true)) {
      return;
    }
    if (!checkValidated()) {
      return;
    }
    postAnswer({
      question_id: data?.qid,
      content: formData.content.value,
      html: marked.parse(formData.content.value),
    })
      .then((res) => {
        setShowEditor(false);
        setFormData({
          content: {
            value: '',
            isInvalid: false,
            errorMsg: '',
          },
        });
        callback?.(res.info);
      })
      .catch((ex) => {
        if (ex.isError) {
          const stateData = handleFormError(ex, formData);
          setFormData({ ...stateData });
        }
      });
  };

  const clickBtn = () => {
    if (!guard.tryNormalLogged(true)) {
      return;
    }
    if (data?.answered && !showEditor) {
      Modal.confirm({
        title: t('confirm_title'),
        content: t('confirm_info'),
        confirmText: t('continue'),
        onConfirm: () => {
          setShowEditor(true);
        },
      });
      return;
    }

    if (!showEditor) {
      setShowEditor(true);
      return;
    }

    handleSubmit();
  };
  const handleFocusForTextArea = (evt) => {
    if (!guard.tryNormalLogged(true)) {
      evt.currentTarget.blur();
      return;
    }
    setFocusType('answer');
    setShowEditor(true);
    setEditorFocusState(true);
  };

  return (
    <Form noValidate className="mt-4">
      {(!data.answered || showEditor) && (
        <Form.Group className="mb-3">
          <Form.Label>
            <h5>{t('title')}</h5>
          </Form.Label>
          <Form.Control
            isInvalid={formData.content.isInvalid}
            className="d-none"
          />
          {!showEditor && !data.answered && (
            <div className="d-flex">
              <TextArea
                className="w-100"
                rows={8}
                autoFocus={false}
                onFocus={handleFocusForTextArea}
              />
            </div>
          )}
          {showEditor && (
            <TextEditor
              initialState={formData.content.value}
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
                  console.log('content', content);
                  // form?.setFieldsValue({state})
                  // form?.setFieldsValue({content})
                });
              }}
            />
          )}

          <Form.Control.Feedback type="invalid">
            {formData.content.errorMsg}
          </Form.Control.Feedback>
        </Form.Group>
      )}

      {data.answered && !showEditor ? (
        <Button onClick={clickBtn}>{t('add_another_answer')}</Button>
      ) : (
        <Button onClick={clickBtn}>{t('btn_name')}</Button>
      )}
      {modalState.open && (
        <MaterialModal
          visible={modalState.open}
          setModalState={setModalState}
          onInsert={modalState?.onInsert}
        />
      )}
    </Form>
  );
};

export default memo(Index);
