import * as React from 'react';
import Tab from '@mui/material/Tab';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import EditorContentsStore from '../../stores/editorContentsStore';

interface CustomTabProps {
  content?: any;
  index?: number;
}

const getFileName = (path) => {
  const pathArray: Array<String> = path.split('/');
  const fileName = pathArray[pathArray.length - 1];
  return fileName;
};

export default function CustomTab(props: CustomTabProps) {
  const { content, index } = props;
  return (
    <div>
      <Tab
        label={getFileName(content.path)}
        onClick={() => {
          EditorContentsStore.updateVeiwIndex(index);
        }}
        sx={{ textTransform: 'none' }}
      ></Tab>
      <Button
        onClick={() => {
          EditorContentsStore.deleteContentAction(content.path, index);
        }}
      >
        <CloseIcon />
      </Button>
    </div>
  );
}
