import { Dispatch, FC, memo, SetStateAction, useState } from 'react';
import { Button, Form, Modal, Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { Modal as AnswerModal } from '@/components';
import { uploadImage } from '@/services';

export type LinkType = {
  value: string;
  isInvalid: boolean;
  errorMsg: string;
  type: string;
};

export type ModalStateType = {
  open: boolean;
  onInsert?: (link: LinkType) => void;
};

interface Props {
  visible: boolean;
  setModalState: Dispatch<SetStateAction<ModalStateType>>;
  onInsert?: (link: LinkType) => void;
}

const MaterialModal: FC<Props> = ({
  visible = false,
  setModalState,
  onInsert,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'editor' });
  const [imageName, setImageName] = useState({
    value: '',
    isInvalid: false,
    errorMsg: '',
  });
  const [link, setLink] = useState({
    value: '',
    isInvalid: false,
    errorMsg: '',
    type: '',
  });

  const verifyImageSize = (files: FileList) => {
    if (files.length === 0) {
      return false;
    }
    const filteredFiles = Array.from(files).filter(
      (file) => file.type.indexOf('image') === -1,
    );

    if (filteredFiles.length > 0) {
      AnswerModal.confirm({
        content: t('image.form_image.fields.file.msg.only_image'),
      });
      return false;
    }
    const filteredImages = Array.from(files).filter(
      (file) => file.size / 1024 / 1024 > 4,
    );

    if (filteredImages.length > 0) {
      AnswerModal.confirm({
        content: t('image.form_image.fields.file.msg.max_size'),
      });
      return false;
    }
    return true;
  };

  const onHide = () => setModalState({ open: false });

  // const handleSelect = (tab) => {
  //   setCurrentTab(tab);
  // };

  const handleClick = () => {
    if (link && onInsert) {
      onInsert(link);
    }
    console.log('link', link);
    // if (!editor) {
    //   return;
    // }
    if (!link.value) {
      setLink({ ...link, isInvalid: true });
      return;
    }
    setLink({ ...link, type: '' });

    // const text = `![${imageName.value}](${link.value})`;

    // editor.replaceSelection(text);

    setModalState({ open: false });

    // editor.focus();
    setLink({ ...link, value: '' });
    setImageName({ ...imageName, value: '' });
  };

  const onUpload = async (e) => {
    // if (!editor) {
    //   return;
    // }
    const files = e.target?.files || [];
    const bool = verifyImageSize(files);

    if (!bool) {
      return;
    }

    uploadImage({ file: e.target.files[0], type: 'post' }).then((url) => {
      setLink({ ...link, value: url });
    });
    // uploadImage({ file: e.target.files[0], type: 'post' }).then((url) => {
    //   const newLink={ ...link, value: url }
    //   setLink(newLink);
    //   onInsert(newLink)
    // });
  };

  return (
    <Modal show={visible} onHide={onHide} fullscreen="sm-down">
      <Modal.Header closeButton>
        <h5 className="mb-0">{t('image.add_image')}</h5>
      </Modal.Header>
      <Modal.Body>
        <Tabs>
          <Tab eventKey="localImage" title={t('image.tab_image')}>
            <Form className="mt-3" onSubmit={handleClick}>
              <Form.Group controlId="editor.imgLink" className="mb-3">
                <Form.Label>
                  {t('image.form_image.fields.file.label')}
                </Form.Label>
                <Form.Control
                  type="file"
                  onChange={onUpload}
                  isInvalid={link.isInvalid}
                />

                <Form.Control.Feedback type="invalid">
                  {t('image.form_image.fields.file.msg.empty')}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="editor.imgDescription" className="mb-3">
                <Form.Label>
                  {`${t('image.form_image.fields.desc.label')} ${t('optional', {
                    keyPrefix: 'form',
                  })}`}
                </Form.Label>
                <Form.Control
                  type="text"
                  value={imageName.value}
                  onChange={(e) =>
                    setImageName({ ...imageName, value: e.target.value })
                  }
                  isInvalid={imageName.isInvalid}
                />
              </Form.Group>
            </Form>
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="link" onClick={() => setModalState({ open: false })}>
          {t('image.btn_cancel')}
        </Button>
        <Button variant="primary" onClick={handleClick}>
          {t('image.btn_confirm')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default memo(MaterialModal);
